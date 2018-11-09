# Changelog
All notable changes to this project will be documented in this file.

## [0.3.3] - 2018-11-9
### Fixed
- Fix the requested ratio for webrtc video

## [0.3.2] - 2018-10-21
### Added
- Squared summed area table operation `gm.sqsat`
### Changed
- Opearation renamed `gm.summedAreaTable` -> `gm.sat`
### Fixed
- Enhance precision of floats encode/decode on iOS devices


## [0.3.1] - 2018-10-14
### Fixed
- PCLines operation extra lines bug on Safari (part of https://github.com/PeculiarVentures/GammaCV/issues/25)

## [0.3.0] - 2018-08-29
### Added
- Export internal PCLines functions:
    - `gm.pcLines`
    - `gm.pcLinesEnhance`
    - `gm.pcLinesReduceMax`
    - `gm.pcLinesTransform`
- Math Operations:
    - `gm.sub`
    - `gm.div`
    - `gm.mult`
    - `gm.add`
    - `gm.subScalar`
    - `gm.divScalar`
    - `gm.multScalar`
    - `gm.addScalar`
- Haar features related functions:
    - `gm.calcHAARFeature`
    - `gm.calcIntegralSum`
### Changed
- Bundle size reduced by removing comments from glsl operations

## [0.2.0] - 2018-07-24
### Added
- Convolution 2d operation `gm.conv2d`
- Convolution builtin kernels `gm.kernels`
- Upsample operation `gm.upsample`
- Summed Area Table operation (Integral image) `gm.summedAreaTable`
- Adaptive threshold operation `gm.adaptiveThreshold`
- util function `gm.tensorFromFlat`

## [0.1.0] - 2018-07-18
### Added
- Morphological operations:
    - Dilate `gm.dilate`
    - Erode `gm.erode`
    - Extended Morphology `gm.morphologyEx`
- Substract operation `gm.sub`
- util function `gm.tensorAssertMSEEqual`
### Changed
- Allow alpha channel in threshold operation