# Changelog
All notable changes to this project will be documented in this file.

## [0.4.1] - 2020-12-23
### Fixed
- Assertion for WebGL availability (https://github.com/PeculiarVentures/GammaCV/pull/77)
- Typescript typings for some operations

## [0.4.0] - 2020-10-13
### Added
- Resize operation `gm.resize`
- Ability to use HTMLCanvasElement and HTMLVideoElement as operation input
- Experimental feature with output directly into canvas with context 2d
### Changed
- Algorithms used in `gm.upsample` and `gm.downsample`
### Fixed
- Typo in `Tensor.release` method (https://github.com/PeculiarVentures/GammaCV/issues/62)
- Bugs in `gm.upsample` and `gm.downsample` operations on some video hardware (https://github.com/PeculiarVentures/GammaCV/issues/36)

## [0.3.10] - 2020-02-03
### Fixed
- Typescript typings
- Cross Origin Issue for imageTensorFromURL (@adamelmore)

## [0.3.8] - 2019-06-23
### Added
- Typescript support

## [0.3.6] - 2019-03-24
### Added
- Shortcut for library as umd module: `gm`.
### Changed
- Enhance performance when float polyfill is not needed
- KernelConstructor: make arguments of main glsl function optional for check.
- Enhance errors messages

## [0.3.5] - 2018-12-17
### Changed
- Downsample operation supports RGBA (#32), add test

## [0.3.4] - 2018-11-9
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