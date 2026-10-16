#!/usr/bin/env python3
"""Merge and verify only the three source blocks the user downloaded locally."""
import hashlib
import json
import os
from pathlib import Path
import tempfile

NAME = 'Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz'
SIZE = 56817403
SHA256 = '9c018a2f6e8379b2c3bae434c9942909d839e2274a75633be24330cc91708fab'
HERE = Path(__file__).resolve().parent

def digest(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        while block := stream.read(1024 * 1024):
            result.update(block)
    return result.hexdigest()

def main():
    metadata = json.loads((HERE / 'SHA256SUMS.json').read_text())
    if metadata['archive'] != {'name': NAME, 'bytes': SIZE, 'sha256': SHA256}:
        raise ValueError('Unexpected complete-source identity')
    parts = metadata['parts']
    expected_names = [NAME + '.part01', NAME + '.part02', NAME + '.part03']
    if [part['name'] for part in parts] != expected_names:
        raise ValueError('Expected exactly the three documented local blocks')
    if [part['bytes'] for part in parts] != [20971520, 20971520, 14874363]:
        raise ValueError('Unexpected block sizes')
    destination = HERE / NAME
    if destination.exists():
        if destination.stat().st_size == SIZE and digest(destination) == SHA256:
            print('Existing complete source archive verified:', destination.name)
            return
        raise FileExistsError('Existing output is different; no file was overwritten')
    temporary_name = None
    try:
        final_digest = hashlib.sha256()
        total = 0
        with tempfile.NamedTemporaryFile(prefix='.keepsail-source-', dir=HERE, delete=False) as output:
            temporary_name = output.name
            for part in parts:
                source = HERE / part['name']
                if source.stat().st_size != part['bytes']:
                    raise ValueError('Wrong size: ' + source.name)
                part_digest = hashlib.sha256()
                with source.open('rb') as input_file:
                    while block := input_file.read(1024 * 1024):
                        part_digest.update(block)
                        final_digest.update(block)
                        total += len(block)
                        output.write(block)
                if part_digest.hexdigest() != part['sha256']:
                    raise ValueError('Checksum failed: ' + source.name)
            output.flush()
            os.fsync(output.fileno())
        if total != SIZE or final_digest.hexdigest() != SHA256:
            raise ValueError('Complete source checksum failed')
        # Linking is atomic and refuses to replace an existing destination.
        os.link(temporary_name, destination)
        print('Verified source archive:', destination.name)
        print('SHA256:', SHA256)
    finally:
        if temporary_name is not None:
            Path(temporary_name).unlink(missing_ok=True)

if __name__ == '__main__':
    main()
