# i2c-bus-fivdi

Providing a wrapper around node module `i2c-bus` (by [Fivdi](https://github.com/fivdi/i2c-bus/)) to expose an `I2CBus` (from [AOD](https://github.com/johntalton/and-other-delights)) compatible interface.


[![CI](https://github.com/johntalton/i2c-bus-fivdi/actions/workflows/CI.yml/badge.svg)](https://github.com/johntalton/i2c-bus-fivdi/actions/workflows/CI.yml)
![GitHub](https://img.shields.io/github/license/johntalton/i2c-bus-fivdi)

## Background

While AOD's `I2CBus` provide a more limited API, it is also suitable for a wider range of underlining implementations (such as [MCP2221](https://github.com/johntalton/i2c-bus-mcp2221) and Excamera Labs [i2cDriver](https://github.com/johntalton/i2c-bus-excamera-i2cdriver) which both are WebSerial and WebHID compatible implementations)

Also, `I2CBus` interface is defined in terms of `ArrayBuffer` and `ArrayBufferView` instead of the Node specific `Buffer`.  This allows for more flexibility in non-node environments.

## Example

Simple example to access AHT20 temperature sensor on a raspberry pi with I²C enabled on `/dev/i2c-1`

```javascript
import { FivdiBusProvider } from '@johntalton/i2c-bus-fivdi'
import { I2CAddressedBus } from '@johntalton/and-other-delights'
import { AHT20, DEFAULT_ADDRESS } from '@johntalton/aht20'

const I2C_BUS_NUMBER = 1 // reference to /dev/i2c-1

const bus = await FivdiBusProvider.openPromisified(I2C_BUS_NUMBER)
const abus = I2CAddressedBus.from(bus, DEFAULT_ADDRESS)
const device = AHT20.from(abus)

const { temperatureC } = await device.getMeasurement()

```