let serverPort = 0

/**
 * @return {number}
 */
export function GetPort() {
    return serverPort
}

export function UpdatePort(port){
    serverPort = port
}