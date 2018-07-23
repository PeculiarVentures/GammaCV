# Changelog
All notable changes to this project will be documented in this file.

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