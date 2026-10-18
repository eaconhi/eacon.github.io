# Build 66 dynamic-library mechanism — evidence and remaining checks

The distributor records LGPLv3 section 4(d)(1)'s shared-library mechanism as the proposed mechanism. The Build 66 archive contains eight separate dynamic frameworks and an unencrypted local application executable with the corresponding `@rpath` dependencies and `@executable_path/Frameworks` search path. `SOURCE-MAPPING.json` records exact source-build section correspondence. The source archive itself is unchanged.

For a recipient who actually has a modifiable application bundle, compatible modified libraries would be rebuilt, substituted as a matching framework set in a separate working copy, signed with the recipient's own authorized Apple identity/profiles, verified and installed using applicable Apple procedures. Frameworks are signed before extensions and the main App. Publisher private keys are not provided. Apple sign-in/iCloud/App Group authorization is separate and is not promised to work across signing teams.

These instructions alone do not supply a modifiable App bundle, application object files or private signing rights. App Store downloads may be encrypted. No App executable/IPA or full App source is included in this public-material candidate. The local Build 66 archive is not a publicly delivered artifact.

A compatible modified-library substitution, re-sign, device installation and successful media operation have not been verified. The applicability/sufficiency of LGPLv3 4(d)(1) and installation information under 4(e), including its GPLv3 section 6 condition, remains a release assessment; this packet makes no legal sufficiency determination. If another delivery mechanism is selected, its corresponding materials must be prepared and actually delivered separately. Do not infer completion from an archive path, a `.framework` name or App Store upload status.

App terms do not restrict modification of LGPL-covered library portions or reverse engineering needed to debug those modifications. Full license texts and original notices remain available in the corresponding-source materials and `licenses/`.
