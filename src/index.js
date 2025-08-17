import * as i2c from 'i2c-bus'

/** @import { I2CBus, I2CBufferSource, I2CReadResult, I2CWriteResult, I2CAddress } from '@johntalton/and-other-delights' */

const BASE_NAME = 'Fivdi'


export class FivdiBusProvider {
	static async openPromisified(busNumber) {
		return new FivdiBus(await i2c.openPromisified(busNumber), `${BASE_NAME}-${busNumber}`)
	}
}

/**
 * @implements {I2CBus}
 */
export class FivdiBus {
	/** @type {i2c.PromisifiedBus} */
	#bus
	#name

	/**
	 * @param {i2c.PromisifiedBus} i2cBus
	 */
	constructor(i2cBus, name) {
		this.#name = name ?? BASE_NAME
		this.#bus = i2cBus
	}

	get supportsScan() { return true }
	get supportsMultiByteDataAddress() { return false }

	get name() { return this.#name }

	close() { this.#bus.close() }

	/**
	 * @param {I2CAddress} address
	 * @param {number} byteValue
	 * @returns {Promise<void>}
	 */
	sendByte(address, byteValue) {
		return this.#bus.sendByte(address, byteValue)
	}

	/**
	 * @param {I2CAddress} address
	 * @param {number} cmd
	 * @param {number} length
	 * @param {I2CBufferSource} bufferSource
	 * @returns {Promise<I2CReadResult>}
	 */
	async readI2cBlock(address, cmd, length, bufferSource) {
		const intoBuffer = ArrayBuffer.isView(bufferSource) ?
			Buffer.from(bufferSource.buffer, bufferSource.byteOffset, bufferSource.byteLength) :
			Buffer.from(bufferSource)
		const { bytesRead, buffer } = await this.#bus.readI2cBlock(address, cmd, length, intoBuffer)
		return {
			bytesRead,
			buffer: new Uint8Array(buffer.buffer, buffer.byteOffset, bytesRead)
		}
	}

	/**
	 * @param {I2CAddress} address
	 * @param {number} cmd
	 * @param {number} length
	 * @param {I2CBufferSource} bufferSource
	 * @returns {Promise<I2CWriteResult>}
	 */
	async writeI2cBlock(address, cmd, length, bufferSource) {
		const bufferToWrite = ArrayBuffer.isView(bufferSource) ?
			Buffer.from(bufferSource.buffer, bufferSource.byteOffset, bufferSource.byteLength) :
			Buffer.from(bufferSource)
		const { bytesWritten, buffer } = await this.#bus.writeI2cBlock(address, cmd, length, bufferToWrite)
		return {
			bytesWritten,
			buffer: new Uint8Array(buffer.buffer, buffer.byteOffset, bytesWritten)
		}
	}

	/**
	 * @param {I2CAddress} address
	 * @param {number} length
	 * @param {I2CBufferSource} bufferSource
	 * @returns {Promise<I2CReadResult>}
	 */
	async i2cRead(address, length, bufferSource) {
		const intoBuffer = ArrayBuffer.isView(bufferSource) ?
			Buffer.from(bufferSource.buffer, bufferSource.byteOffset, bufferSource.byteLength) :
			Buffer.from(bufferSource)
		const { bytesRead, buffer } = await this.#bus.i2cRead(address, length, intoBuffer)
		return {
			bytesRead,
			buffer: new Uint8Array(buffer.buffer, buffer.byteOffset, bytesRead)
		}
	}

	/**
	 * @param {I2CAddress} address
	 * @param {number} length
	 * @param {I2CBufferSource} bufferSource
   * @returns {Promise<I2CWriteResult>}
   */
	async i2cWrite(address, length, bufferSource) {
		const bufferToWrite = ArrayBuffer.isView(bufferSource) ?
			Buffer.from(bufferSource.buffer, bufferSource.byteOffset, bufferSource.byteLength) :
			Buffer.from(bufferSource)
		const { bytesWritten, buffer } = await this.#bus.i2cWrite(address, length, bufferToWrite)
		return {
			bytesWritten,
			buffer: new Uint8Array(buffer.buffer, buffer.byteOffset, bytesWritten)
		}
	}

	/**
	 * @returns {Promise<I2CAddress[]>}
	 */
	async scan() { return this.#bus.scan() }
}
