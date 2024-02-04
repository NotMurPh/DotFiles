export default {
    "port": 9898,
    "packetTypes": {
        "0": "connectionSuccess",
        "1": "data",
        "2": "joinServer",
        "3": "ping",
        "4": "serverReboot",
        "5": "debug"
    },
    "packetTypesReverse": {
        "connectionSuccess": "0",
        "data": "1",
        "joinServer": "2",
        "ping": "3",
        "serverReboot": "4",
        "debug": "5"
    },
    "servers": {
        "0": {
            "name": "soopyapis",
            "displayName": "SoopyApi",
            "module": "soopyApis"
        },
        "1": {
            "name": "soopytestchatthing",
            "displayName": "SoopyTestChatThing",
            "module": "SoopyTestChatThing"
        },
        "2": {
            "name": "minewaypoints",
            "displayName": "Mine Way Points",
            "module": "minewaypoints"
        },
        "3": {
            "name": "soopyv2",
            "displayName": "SoopyV2",
            "module": "SoopyV2"
        },
        "4": {
            "name": "sbgbot",
            "displayName": "SbgBot",
            "module": "sbgbot"
        },
        "5": {
            "name": "socketutils",
            "displayName": "SocketUtils",
            "module": "socketUtils"
        },
        "6": {
            "name": "legalmap",
            "displayName": "LegalMap",
            "module": "LegalMap"
        },
        "7": {
            "name": "bettermap",
            "displayName": "BetterMap",
            "module": "BetterMap"
        }
    },
    "serverNameToId": {
        "soopyapis": "0",
        "soopytestchatthing": "1",
        "minewaypoints": "2",
        "soopyv2": "3",
        "sbgbot": "4",
        "socketutils": "5",
        "legalmap": "6",
        "bettermap": "7"
    }
}