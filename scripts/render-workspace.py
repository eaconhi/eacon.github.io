"""Render an original, physically modelled workspace and a continuous dolly shot.

Tested with Blender 4.5.9 LTS:
    blender --background --python scripts/render-workspace.py -- \
        --output-dir ./workspace-frames --frames 168 --width 1280 --height 720

Add --preview to render only the first, middle, and final frames. The same
camera path is used in both modes, so previews do not require a second scene.
All geometry, materials, lighting, and screen artwork are original and created
here; there are no downloads, fonts, external textures, or image billboards.
"""

from __future__ import annotations

import argparse
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("workspace-frames"))
    parser.add_argument("--frames", type=int, default=168)
    parser.add_argument("--width", type=int, default=1280)
    parser.add_argument("--height", type=int, default=720)
    parser.add_argument("--samples", type=int, default=32)
    parser.add_argument("--preview", action="store_true")
    args = parser.parse_args(argv)
    for name in ("frames", "width", "height", "samples"):
        if getattr(args, name) < 1:
            parser.error(f"--{name} must be greater than zero")
    return args


def material(name, color, roughness=0.45, metallic=0.0, emission=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission:
        emission_input = bsdf.inputs.get("Emission Color") or bsdf.inputs.get("Emission")
        emission_input.default_value = (*color, 1)
        strength_input = bsdf.inputs.get("Emission Strength")
        if strength_input is not None:
            strength_input.default_value = emission
    return mat


def glass_material():
    # Explicit transparency works consistently in EEVEE without a screen-space
    # refraction pass. There are still real separate glass panes and frames.
    mat = bpy.data.materials.new("Architectural glass · quiet smoked reflection")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    transparent = nodes.new("ShaderNodeBsdfTransparent")
    transparent.inputs[0].default_value = (0.93, 0.97, 0.98, 1)
    reflection = nodes.new("ShaderNodeBsdfPrincipled")
    reflection.inputs["Base Color"].default_value = (0.17, 0.22, 0.23, 1)
    reflection.inputs["Metallic"].default_value = 0.7
    reflection.inputs["Roughness"].default_value = 0.12
    layer = nodes.new("ShaderNodeLayerWeight")
    layer.inputs["Blend"].default_value = 0.18
    scale = nodes.new("ShaderNodeMath")
    scale.operation = "MULTIPLY_ADD"
    scale.inputs[1].default_value = 0.27
    scale.inputs[2].default_value = 0.025
    mix = nodes.new("ShaderNodeMixShader")
    links = mat.node_tree.links
    links.new(layer.outputs["Fresnel"], scale.inputs[0])
    links.new(scale.outputs[0], mix.inputs[0])
    links.new(transparent.outputs[0], mix.inputs[1])
    links.new(reflection.outputs[0], mix.inputs[2])
    # Glass is deterministic alpha blending, never stochastic dithering. Give
    # shadow rays a perfectly clear surface as well: dozens of superimposed
    # stochastic transparent shadows otherwise add grain to the whole room.
    light_path = nodes.new("ShaderNodeLightPath")
    clear_shadow = nodes.new("ShaderNodeBsdfTransparent")
    clear_shadow.inputs[0].default_value = (1, 1, 1, 1)
    shadow_mix = nodes.new("ShaderNodeMixShader")
    links.new(light_path.outputs["Is Shadow Ray"], shadow_mix.inputs[0])
    links.new(mix.outputs[0], shadow_mix.inputs[1])
    links.new(clear_shadow.outputs[0], shadow_mix.inputs[2])
    links.new(shadow_mix.outputs[0], output.inputs[0])
    if hasattr(mat, "surface_render_method"):
        mat.surface_render_method = "BLENDED"
    elif hasattr(mat, "blend_method"):
        mat.blend_method = "BLEND"
    if hasattr(mat, "shadow_method"):
        mat.shadow_method = "NONE"
    if hasattr(mat, "use_transparency_overlap"):
        mat.use_transparency_overlap = False
    if hasattr(mat, "use_transparent_shadow"):
        mat.use_transparent_shadow = True
    return mat


def cube(name, location, dimensions, mat, bevel=0.025):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft manufactured edges", "BEVEL")
        mod.width = min(bevel, min(dimensions) * 0.3)
        mod.segments = 3
        mod = obj.modifiers.new("Architectural normals", "WEIGHTED_NORMAL")
        mod.keep_sharp = True
    return obj


def cylinder(name, location, radius, depth, mat, vertices=40):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=depth, location=location
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Rounded edge", "BEVEL")
    bevel.width = min(0.015, radius * 0.2, depth * 0.15)
    bevel.segments = 3
    obj.modifiers.new("Smooth normals", "WEIGHTED_NORMAL")
    return obj


def rod(name, start, end, radius, mat):
    a, b = Vector(start), Vector(end)
    obj = cylinder(name, (a + b) / 2, radius, (b - a).length, mat, 20)
    obj.rotation_euler = (b - a).to_track_quat("Z", "Y").to_euler()
    return obj


def line(name, points, radius, mat):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    poly = curve.splines.new("POLY")
    poly.points.add(len(points) - 1)
    for point, coordinate in zip(poly.points, points):
        point.co = (*coordinate, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def area(name, location, target, power, color, size, size_y=None):
    light = bpy.data.lights.new(name, "AREA")
    light.energy = power
    light.color = color
    if hasattr(light, "use_shadow_jitter"):
        light.use_shadow_jitter = False
    light.shape = "RECTANGLE" if size_y is not None else "DISK"
    light.size = size
    if size_y is not None:
        light.size_y = size_y
    obj = bpy.data.objects.new(name, light)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def make_materials():
    return {
        "floor": material("Large graphite limestone", (0.038, 0.049, 0.060), 0.37),
        "wall": material("Graphite acoustic plaster", (0.015, 0.026, 0.037), 0.85),
        "panel": material("Warm charcoal wall panels", (0.022, 0.035, 0.047), 0.72),
        "ceiling": material("Blue graphite mineral ceiling", (0.070, 0.085, 0.100), 0.78),
        "ivory": material("Warm ivory solid surface", (0.55, 0.50, 0.41), 0.29),
        "metal": material("Brushed dark titanium", (0.048, 0.070, 0.092), 0.26, 0.78),
        "black": material("Soft black powdercoat", (0.008, 0.014, 0.021), 0.35, 0.18),
        "shadow": material("Recessed shadow joints", (0.011, 0.013, 0.014), 0.88),
        "wood": material("Smoked walnut endgrain", (0.09, 0.049, 0.025), 0.43),
        "orange": material("Burnished orange accent", (0.82, 0.22, 0.058), 0.36, 0.3),
        "strip": material("Warm amber architectural light", (1.0, 0.13, 0.018), 0.35, emission=2.0),
        "light": material("Frosted warm white light", (1.0, 0.62, 0.27), 0.4, emission=2.0),
        "screen": material("Display deep mineral blue", (0.018, 0.047, 0.074), 0.4, emission=0.85),
        "screen_line": material("Display pale technical lines", (0.19, 0.41, 0.51), 0.5, emission=1.0),
        "screen_orange": material("Display restrained orange", (0.88, 0.19, 0.034), 0.5, emission=1.15),
        "cloth": material("Warm grey upholstery", (0.27, 0.26, 0.23), 0.95),
        "ceramic": material("Matte porcelain", (0.67, 0.62, 0.52), 0.42),
        "coffee": material("Coffee", (0.025, 0.015, 0.009), 0.18),
        "leaf": material("Muted olive foliage", (0.105, 0.15, 0.09), 0.72),
        "glass": glass_material(),
        "skyline": material("Distant blue hour architecture", (0.11, 0.16, 0.21), 0.92),
        "skyline_dark": material("Distant shaded architecture", (0.065, 0.09, 0.125), 0.92),
        "landscape": material("Exterior blue hour ground", (0.08, 0.11, 0.14), 0.95),
    }


def architecture(m):
    # Modelled entrance, corridor, and room share one continuous ground plane.
    cube("Continuous stone floor", (0, -2.5, -0.11), (10.5, 24, 0.22), m["floor"], 0.01)
    cube("Left uninterrupted shadow wall", (-5.08, -0.5, 2.05), (0.2, 14.5, 4.1), m["wall"])
    cube("Monolithic floating ceiling", (0, 0.35, 4.06), (10.3, 13.1, 0.22), m["ceiling"])
    # Sparse seams, deliberately avoiding a futuristic neon grid.
    for x in (-2.4, 2.4):
        cube("Stone expansion joint", (x, -1.5, 0.001), (0.007, 21, 0.003), m["shadow"], 0)
    for y in (-6.1, -0.4, 5.6):
        cube("Stone transverse joint", (0, y, 0.002), (10, 0.006, 0.003), m["shadow"], 0)
    # The camera physically passes this portal; its side faces give parallax.
    for x in (-2.62, 2.62):
        cube("Foreground portal upright", (x, -6.18, 1.65), (0.21, 0.52, 3.3), m["metal"], 0.028)
        cube("Portal warm inner reveal", (x + (0.106 if x < 0 else -0.106), -6.03, 1.65),
             (0.012, 0.15, 3.12), m["strip"], 0.002)
    cube("Foreground portal lintel", (0, -6.18, 3.29), (5.46, 0.52, 0.20), m["metal"], 0.03)
    cube("Portal threshold", (0, -6.18, 0.015), (5.45, 0.52, 0.03), m["metal"], 0.008)
    # Glazing beside the open doorway, not across the camera's path.
    for x in (-3.80, 3.80):
        cube("Entrance glass sidelight", (x, -6.15, 1.64), (2.12, 0.025, 3.2), m["glass"], 0)
        cube("Entrance sidelight base", (x, -6.15, 0.065), (2.18, 0.10, 0.13), m["black"])
        cube("Entrance sidelight top", (x, -6.15, 3.25), (2.18, 0.10, 0.10), m["black"])
    # Restrained architectural details live on the left, leaving a calm text field.
    for index, y in enumerate((-3.7, -1.0, 1.7, 4.4)):
        cube(f"Left acoustic panel {index + 1}", (-4.952, y, 2.04), (0.075, 2.63, 3.76), m["panel"], 0.006)
    cube("Left low floating ledge", (-4.62, 1.25, 0.56), (0.71, 8.55, 0.15), m["black"])
    cube("Left ledge warm reflected seam", (-4.94, 1.25, 0.44), (0.018, 8.3, 0.018), m["strip"], 0.002)
    # Back and right windows establish a genuine background at a different depth.
    for x in (-4.95, -2.45, 0.05, 2.55, 4.95):
        cube("Rear window vertical mullion", (x, 6.8, 2.0), (0.055, 0.13, 3.9), m["metal"], 0.009)
    for x in (-3.7, -1.2, 1.3, 3.75):
        cube("Rear individual glazing", (x, 6.81, 2.0), (2.41, 0.016, 3.86), m["glass"], 0)
    for y in (-4.7, -1.8, 1.1, 4.0, 6.8):
        cube("Right window vertical mullion", (5.0, y, 2.0), (0.13, 0.055, 3.9), m["metal"], 0.009)
    for y in (-3.25, -0.35, 2.55, 5.4):
        cube("Right individual glazing", (5.01, y, 2.0), (0.016, 2.80, 3.86), m["glass"], 0)
    cube("Rear window sill", (0, 6.72, 0.25), (10, 0.46, 0.16), m["ivory"])
    cube("Right window sill", (4.85, 0.6, 0.25), (0.42, 12.3, 0.16), m["ivory"])
    cube("Rear low light reveal", (0, 6.51, 0.16), (9.65, 0.02, 0.025), m["strip"], 0.003)
    for y in (-3.6, 0.1, 3.9):
        cube("Ceiling structural seam", (0, y, 3.932), (9.95, 0.045, 0.026), m["shadow"], 0)
    cube("Ceiling recessed linear luminaire", (2.8, -0.1, 3.923), (0.055, 10.4, 0.028), m["light"], 0.003)
    # Raised rear service cabinet and a long horizontal shelf anchor the skyline.
    cube("Rear suspended credenza", (-1.2, 6.10, 0.73), (5.15, 0.72, 0.67), m["wood"], 0.03)
    cube("Credenza stone top", (-1.2, 6.10, 1.086), (5.23, 0.79, 0.052), m["ivory"], 0.012)
    for x in (-2.91, -1.21, 0.49):
        cube("Credenza flush door seam", (x, 5.735, 0.73), (0.007, 0.009, 0.56), m["shadow"], 0)


def workstation(m):
    # Main subject sits right of frame but remains in the central mobile crop.
    cube("Desk thin ivory worktop", (1.20, 2.55, 0.885), (3.50, 1.48, 0.095), m["ivory"], 0.06)
    cube("Desk graphite undercut", (1.20, 2.56, 0.816), (3.29, 1.26, 0.052), m["black"], 0.018)
    cube("Desk left sculptural support", (-0.23, 2.64, 0.397), (0.17, 1.09, 0.795), m["metal"], 0.038)
    cube("Desk right solid pedestal", (2.51, 2.66, 0.397), (0.53, 1.05, 0.795), m["wood"], 0.028)
    cube("Desk pedestal plinth", (2.51, 2.66, 0.049), (0.43, 0.92, 0.098), m["black"], 0.01)
    for z in (0.29, 0.56):
        cube("Pedestal drawer shadow joint", (2.51, 2.131, z), (0.43, 0.009, 0.006), m["shadow"], 0)
    cube("Desk orange edge detail", (1.65, 1.807, 0.863), (0.46, 0.012, 0.013), m["orange"], 0.003)
    # Monitor is fully modelled, including chamfered housing, foot, and stand.
    cube("Display weighted foot", (1.23, 2.96, 0.951), (0.52, 0.36, 0.038), m["metal"], 0.018)
    cube("Display slender stem", (1.23, 3.065, 1.149), (0.095, 0.105, 0.37), m["metal"], 0.02)
    cube("Display satin enclosure", (1.23, 3.057, 1.694), (2.15, 0.106, 1.17), m["black"], 0.048)
    cube("Display matte screen surface", (1.23, 2.999, 1.702), (2.064, 0.012, 1.075), m["screen"], 0.018)
    # Abstract, nonverbal screen artwork: contour curves and two quiet panels.
    for index in range(15):
        points = []
        for step in range(65):
            u = step / 64
            x = 0.265 + u * 1.48
            z = 1.33 + index * 0.041 + 0.125 * math.sin(u * 5.1 + index * 0.1) * math.exp(-((u - 0.58) / 0.58) ** 2)
            points.append((x, 2.989, z))
        line(f"Display contour {index + 1}", points, 0.0018,
             m["screen_orange"] if index == 7 else m["screen_line"])
    cube("Display quiet right panel", (2.055, 2.986, 1.736), (0.245, 0.006, 0.59), m["black"], 0.008)
    for index, length in enumerate((0.135, 0.084, 0.166, 0.113)):
        cube("Display minimal status mark", (2.01 + length / 2 - 0.05, 2.981, 1.93 - index * 0.074),
             (length, 0.003, 0.012), m["screen_line"], 0.002)
    cylinder("Display indicator", (2.18, 3.001, 1.171), 0.004, 0.005, m["screen_orange"], 16).rotation_euler[0] = math.pi / 2
    # A few recognisable objects reward the final close framing.
    cube("Keyboard low aluminium shell", (0.91, 2.19, 0.965), (0.89, 0.295, 0.043), m["metal"], 0.022)
    for row in range(4):
        for col in range(13):
            cube("Keyboard key", (0.52 + col * 0.064, 2.09 + row * 0.063, 0.991),
                 (0.051, 0.049, 0.012), m["black"], 0.003)
    cube("Keyboard spacebar", (0.91, 2.048, 0.991), (0.29, 0.025, 0.011), m["black"], 0.003)
    cube("Desk felt writing mat", (1.81, 2.18, 0.936), (0.48, 0.39, 0.006), m["cloth"], 0.012)
    cube("Low profile trackpad", (1.80, 2.18, 0.951), (0.285, 0.221, 0.026), m["metal"], 0.016)
    cylinder("Coffee cup saucer", (-0.03, 2.19, 0.950), 0.131, 0.025, m["ceramic"])
    cylinder("Coffee cup", (-0.03, 2.19, 1.035), 0.076, 0.15, m["ceramic"])
    cylinder("Coffee visible surface", (-0.03, 2.19, 1.111), 0.063, 0.0015, m["coffee"])
    bpy.ops.mesh.primitive_torus_add(major_radius=0.041, minor_radius=0.012, major_segments=28,
                                   minor_segments=10, location=(-0.117, 2.19, 1.039), rotation=(math.pi / 2, 0, 0))
    bpy.context.object.name = "Coffee cup handle"
    bpy.context.object.data.materials.append(m["ceramic"])
    for index in range(2):
        obj = cube("Closed unlabelled notebook", (2.46, 2.79, 0.954 + index * 0.027),
                   (0.33, 0.43, 0.026), m["black"] if index else m["orange"], 0.006)
        obj.rotation_euler[2] = -0.08
    rod("Desk pen", (2.37, 2.70, 1.005), (2.57, 2.87, 1.005), 0.006, m["metal"])
    # Thin pendant and its suspension have a distinct depth from the ceiling.
    cube("Suspended linear pendant body", (1.20, 2.6, 3.125), (3.30, 0.105, 0.062), m["black"], 0.014)
    cube("Suspended linear pendant diffuser", (1.20, 2.6, 3.090), (3.18, 0.074, 0.009), m["light"], 0.002)
    for x in (-0.05, 2.45):
        rod("Pendant fine suspension", (x, 2.6, 3.156), (x, 2.6, 3.94), 0.005, m["metal"])
    # Chair stays to the right of the camera path, never colliding with the lens.
    cx, cy = 3.55, 1.41
    cylinder("Chair central support", (cx, cy, 0.31), 0.046, 0.43, m["metal"])
    cube("Chair upholstered seat", (cx, cy, 0.59), (0.64, 0.61, 0.13), m["cloth"], 0.12)
    back = cube("Chair sculpted back", (cx, cy - 0.275, 0.95), (0.62, 0.13, 0.65), m["cloth"], 0.09)
    back.rotation_euler[0] = -0.13
    for side in (-1, 1):
        rod("Chair arm support", (cx + side * 0.31, cy, 0.53), (cx + side * 0.31, cy, 0.82), 0.017, m["metal"])
        cube("Chair soft arm rest", (cx + side * 0.31, cy - 0.02, 0.84), (0.062, 0.39, 0.045), m["black"], 0.016)
    for index in range(5):
        angle = index * 2 * math.pi / 5
        end = (cx + math.cos(angle) * 0.37, cy + math.sin(angle) * 0.37, 0.105)
        rod("Chair radial foot", (cx, cy, 0.20), end, 0.022, m["metal"])
        cylinder("Chair discreet castor", (end[0], end[1], 0.065), 0.041, 0.07, m["black"], 24)


def decor_and_exterior(m):
    # A subdued olive tree adds a natural material without dominating the room.
    px, py = 3.78, 5.59
    cylinder("Planter stone vessel", (px, py, 0.28), 0.275, 0.56, m["ceramic"])
    cylinder("Planter soil", (px, py, 0.564), 0.235, 0.014, m["shadow"])
    rod("Olive trunk", (px, py, 0.5), (px - 0.10, py, 2.02), 0.026, m["wood"])
    rng = random.Random(28)
    for index in range(18):
        angle = index * 2.399
        z = 1.05 + index * 0.064
        radius = 0.32 + 0.14 * math.sin(index * 0.8)
        end = (px + math.cos(angle) * radius, py + math.sin(angle) * radius, z + 0.18)
        rod("Olive fine branch", (px - 0.05, py, z - 0.18), end, 0.007, m["wood"])
        for offset in (-0.07, 0.03, 0.12):
            bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6,
                location=(end[0] + math.cos(angle) * offset, end[1] + math.sin(angle) * offset, end[2] + offset * 0.35))
            leaf = bpy.context.object
            leaf.name = "Olive muted leaf"
            leaf.scale = (0.105, 0.027, 0.013)
            leaf.rotation_euler = (rng.uniform(-0.3, 0.3), rng.uniform(-0.6, 0.2), angle)
            leaf.data.materials.append(m["leaf"])
            for polygon in leaf.data.polygons:
                polygon.use_smooth = True
    cylinder("Credenza sculptural ceramic vase", (-2.30, 6.05, 1.34), 0.13, 0.47, m["ceramic"])
    for index in range(3):
        cube("Credenza unlabelled art book", (-1.77, 6.00, 1.131 + index * 0.04),
             (0.38, 0.35, 0.038), m["cloth"] if index != 1 else m["black"], 0.004)
    cube("Exterior ground beyond windows", (0, 28, -0.36), (110, 100, 0.2), m["landscape"], 0)
    # Nearby terrace rails move faster than the skyline during the dolly.
    cube("Exterior terrace low wall", (0, 9.3, 0.35), (15.2, 0.23, 0.85), m["skyline"], 0.01)
    cube("Exterior terrace right return", (7.7, 2.7, 0.35), (0.23, 13.4, 0.85), m["skyline"], 0.01)
    # Distant volumes are intentionally calm architectural masses, with no grid
    # of bright sci-fi windows. Their actual depth differs by tens of metres.
    buildings = [(-13, 23, 4.1, 3.8, 5.2), (-7.9, 25, 3.0, 4.8, 7.7),
                 (-3.6, 28, 4.0, 3.8, 5.1), (1.4, 25, 3.4, 4.0, 6.2),
                 (6.5, 29, 4.8, 5.0, 9.0), (12.3, 24, 3.4, 4.8, 5.0),
                 (16.5, 19, 3.0, 3.7, 8.0), (19, 9, 4.8, 4.3, 6.2),
                 (-20, 31, 5.8, 6.4, 9.5), (1, 42, 6.0, 5.5, 9.0)]
    for index, (x, y, width, depth, height) in enumerate(buildings):
        mat = m["skyline"] if index % 3 else m["skyline_dark"]
        cube(f"Distant architectural volume {index + 1}", (x, y, height / 2 - 0.2),
             (width, depth, height), mat, 0.035)
        cube("Distant rooftop setback", (x + width * 0.08, y, height + 0.06),
             (width * 0.77, depth * 0.79, 0.50), mat, 0.02)
        for floor in range(1, int(height / 1.15)):
            cube("Distant quiet horizontal facade reveal", (x, y - depth / 2 - 0.005, floor * 1.15),
                 (width * 0.94, 0.012, 0.065), m["skyline_dark"], 0)


def lighting(m):
    scene = bpy.context.scene
    world = bpy.data.worlds.new("Blue hour architectural atmosphere")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.12, 0.21, 0.34, 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.28
    scene.world = world
    area("Broad right blue hour light", (7.0, 0.5, 5.8), (0.2, 2.1, 0.7), 550, (0.38, 0.56, 1.0), 7.5, 5)
    area("Rear window blue hour atmosphere", (-1, 9.0, 5.5), (0, 1.5, 1), 280, (0.45, 0.62, 1.0), 8, 5)
    area("Desk pendant useful warm light", (1.2, 2.60, 3.02), (1.2, 2.55, 0.8), 170, (1.0, 0.70, 0.43), 2.9, 0.24)
    area("Ceiling quiet cool bounce", (0.4, -0.6, 3.79), (0.4, 1.2, 0.2), 140, (0.65, 0.75, 1.0), 5.0, 4.0)
    area("Entrance ambient lift", (0, -8.2, 3.65), (0, -4.8, 1.0), 90, (0.50, 0.67, 1.0), 4.5, 2.5)
    area("Quiet screen light", (1.23, 2.96, 1.68), (1.2, 1.9, 1.1), 18, (0.37, 0.65, 1.0), 1.5, 0.65)
    area("Rear amber floor wash", (0, 6.39, 0.31), (0, 4.5, 0.1), 68, (1.0, 0.22, 0.035), 8.5, 0.13)
    area("Left ledge amber reflected wash", (-4.76, 1.25, 0.47), (-3.8, 1.25, 0.1), 35,
         (1.0, 0.22, 0.035), 0.12, 7.7)
    # Light the two near reveals independently so they do not look like flat
    # composited bars when the camera draws alongside them.
    for x in (-2.48, 2.48):
        area("Portal amber bounce", (x, -6.11, 1.75), (x * 0.75, -5.2, 1.7),
             65, (1.0, 0.22, 0.035), 2.8, 0.08)
    sun = bpy.data.lights.new("Blue hour distant ambient direction", "SUN")
    sun.energy = 0.16
    sun.angle = math.radians(12)
    sun.color = (0.36, 0.50, 0.80)
    if hasattr(sun, "use_shadow_jitter"):
        sun.use_shadow_jitter = False
    sun_obj = bpy.data.objects.new("Blue hour distant ambient direction", sun)
    bpy.context.collection.objects.link(sun_obj)
    sun_obj.rotation_euler = (math.radians(28), math.radians(-28), math.radians(-38))


def configure_render(args):
    scene = bpy.context.scene
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            scene.render.engine = engine
            break
        except TypeError:
            continue
    scene.render.resolution_x = args.width
    scene.render.resolution_y = args.height
    scene.render.resolution_percentage = 100
    scene.render.fps = 24
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 15
    scene.render.use_file_extension = True
    scene.frame_start = 1
    scene.frame_end = args.frames
    eevee = getattr(scene, "eevee", None)
    if eevee is not None:
        for key, value in (("taa_render_samples", args.samples), ("taa_samples", args.samples),
                           ("use_gtao", True), ("gtao_distance", 3.0), ("gtao_factor", 1.12),
                           ("use_soft_shadows", True), ("use_raytracing", False),
                           ("use_shadow_jitter_viewport", False),
                           ("shadow_ray_count", 4), ("shadow_step_count", 8)):
            if hasattr(eevee, key):
                setattr(eevee, key, value)
    for transform in ("AgX", "Filmic", "Standard"):
        try:
            scene.view_settings.view_transform = transform
            break
        except TypeError:
            continue
    for look in ("AgX - Medium High Contrast", "Medium High Contrast", "None"):
        try:
            scene.view_settings.look = look
            break
        except TypeError:
            continue
    scene.view_settings.exposure = 0.05
    scene.view_settings.gamma = 1.0
    # A trace of lens halation around actual emissive geometry, with no fog or
    # volumetric lighting to keep frame times suitable for a website sequence.
    scene.use_nodes = True
    nodes = scene.node_tree.nodes
    nodes.clear()
    render = nodes.new("CompositorNodeRLayers")
    glare = nodes.new("CompositorNodeGlare")
    glare.glare_type = "FOG_GLOW"
    glare.quality = "MEDIUM"
    glare.threshold = 2.0
    glare.size = 6
    glare.mix = -0.965
    composite = nodes.new("CompositorNodeComposite")
    scene.node_tree.links.new(render.outputs["Image"], glare.inputs["Image"])
    scene.node_tree.links.new(glare.outputs["Image"], composite.inputs["Image"])


def make_camera(args):
    data = bpy.data.cameras.new("28mm continuous architectural dolly")
    obj = bpy.data.objects.new("28mm continuous architectural dolly", data)
    bpy.context.collection.objects.link(obj)
    bpy.context.scene.camera = obj
    data.lens = 28  # Fixed focal length: every change in perspective is real motion.
    data.sensor_width = 36
    data.clip_start = 0.06
    data.clip_end = 180
    data.dof.use_dof = False  # Crisp architecture and readable desktop at every scroll position.
    positions = []
    for frame in range(1, args.frames + 1):
        t = (frame - 1) / max(1, args.frames - 1)
        eased = t * t * t * (t * (t * 6 - 15) + 10)
        # The 9.8m track crosses the entrance plane at y=-6.18. A small lateral
        # drift separates the near frame, desk, windows, and distant skyline.
        obj.location = (0.10 + 0.58 * eased, -10.4 + 9.8 * eased, 1.72 - 0.09 * eased)
        target = Vector((0.68 + 0.55 * eased, 3.05, 1.71 - 0.23 * eased))
        obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()
        obj.keyframe_insert(data_path="location", frame=frame)
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
        positions.append({"frame": frame, "position": list(obj.location), "target": list(target)})
    return positions


def main():
    args = parse_args()
    args.output_dir = args.output_dir.expanduser().resolve()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    configure_render(args)
    mats = make_materials()
    architecture(mats)
    workstation(mats)
    decor_and_exterior(mats)
    lighting(mats)
    positions = make_camera(args)
    scene = bpy.context.scene
    frames = sorted({1, 1 + (args.frames - 1) // 2, args.frames}) if args.preview else range(1, args.frames + 1)
    manifest = {
        "name": "Eacon original architectural workspace",
        "geometry": "Procedurally modelled 3D; no image planes or downloaded assets",
        "camera": "Fixed 28mm lens; 9.8 metre forward dolly plus 0.58 metre lateral drift",
        "fps": 24,
        "frameCount": args.frames,
        "durationSeconds": args.frames / 24,
        "width": args.width,
        "height": args.height,
        "samples": args.samples,
        "preview": args.preview,
        "renderedFrames": list(frames),
        "filenamePattern": "frame-%04d.png",
        "cameraPath": positions,
    }
    (args.output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    scene.frame_set(1)
    # Keep the source scene with the sequence so renders are reproducible and
    # the parent process can inspect or rerender any individual camera position.
    bpy.ops.wm.save_as_mainfile(filepath=str(args.output_dir / "workspace.blend"))
    for frame in frames:
        scene.frame_set(frame)
        scene.render.filepath = str(args.output_dir / f"frame-{frame:04d}.png")
        print(f"WORKSPACE_RENDER frame={frame}/{args.frames} file={scene.render.filepath}", flush=True)
        bpy.ops.render.render(write_still=True)
    print(f"WORKSPACE_COMPLETE directory={args.output_dir} frames={len(frames)}", flush=True)


if __name__ == "__main__":
    main()
