import * as t from './types';

export const COMMANDS = {
    "version": [0, [t.uint8_t],
        [t.uint8_t, t.uint8_t, t.uint16_t]
    ],
    "getConfigurationValue": [82, [t.EzspConfigId],
        [t.EzspStatus, t.uint16_t]
    ],
    "setConfigurationValue": [83, [t.EzspConfigId, t.uint16_t],
        [t.EzspStatus]
    ],
    "setPolicy": [85, [t.EzspPolicyId, t.EzspDecisionId],
        [t.EzspStatus]
    ],
    "getPolicy": [86, [t.EzspPolicyId],
        [t.EzspStatus, t.EzspDecisionId]
    ],
    "getValue": [170, [t.EzspValueId],
        [t.EzspStatus, t.LVBytes]
    ],
    "getExtendedValue": [3, [t.EzspExtendedValueId, t.uint32_t],
        [t.EzspStatus, t.LVBytes]
    ],
    "setValue": [171, [t.EzspValueId, t.LVBytes],
        [t.EzspStatus]
    ],
    "setGpioCurrentConfiguration": [172, [t.uint8_t, t.uint8_t, t.uint8_t],
        [t.EzspStatus]
    ],
    "setGpioPowerUpDownConfiguration": [173, [t.uint8_t, t.uint8_t, t.uint8_t, t.uint8_t, t.uint8_t],
        [t.EzspStatus]
    ],
    "setGpioRadioPowerMask": [174, [t.uint32_t],
        []
    ],
    "setCtune": [245, [t.uint16_t],
        []
    ],
    "getCtune": [246, [],
        [t.uint16_t]
    ],
    "setChannelMap": [247, [t.uint8_t, t.uint8_t],
        []
    ],
    "nop": [5, [],
        []
    ],
    "echo": [129, [t.LVBytes],
        [t.LVBytes]
    ],
    "invalidCommand": [88, [],
        [t.EzspStatus]
    ],
    "callback": [6, [],
        []
    ],
    "noCallbacks": [7, [],
        []
    ],
    "setToken": [9, [t.uint8_t, t.fixed_list(8, t.uint8_t)],
        [t.EmberStatus]
    ],
    "getToken": [10, [t.uint8_t],
        [t.EmberStatus, t.fixed_list(8, t.uint8_t)]
    ],
    "getMfgToken": [11, [t.EzspMfgTokenId],
        [t.LVBytes]
    ],
    "setMfgToken": [12, [t.EzspMfgTokenId, t.LVBytes],
        [t.EmberStatus]
    ],
    "stackTokenChangedHandler": [13, [],
        [t.uint16_t]
    ],
    "getRandomNumber": [73, [],
        [t.EmberStatus, t.uint16_t]
    ],
    "setTimer": [14, [t.uint8_t, t.uint16_t, t.EmberEventUnits, t.Bool],
        [t.EmberStatus]
    ],
    "getTimer": [78, [t.uint8_t],
        [t.uint16_t, t.EmberEventUnits, t.Bool]
    ],
    "timerHandler": [15, [],
        [t.uint8_t]
    ],
    "debugWrite": [18, [t.Bool, t.LVBytes],
        [t.EmberStatus]
    ],
    "readAndClearCounters": [101, [],
        [t.fixed_list(t.EmberCounterType.COUNTER_TYPE_COUNT, t.uint16_t)]
    ],
    "readCounters": [241, [],
        [t.fixed_list(t.EmberCounterType.COUNTER_TYPE_COUNT, t.uint16_t)]
    ],
    "counterRolloverHandler": [242, [],
        [t.EmberCounterType]
    ],
    "delayTest": [157, [t.uint16_t],
        []
    ],
    "getLibraryStatus": [1, [t.uint8_t],
        [t.EmberLibraryStatus]
    ],
    "getXncpInfo": [19, [],
        [t.EmberStatus, t.uint16_t, t.uint16_t]
    ],
    "customFrame": [71, [t.LVBytes],
        [t.EmberStatus, t.LVBytes]
    ],
    "customFrameHandler": [84, [],
        [t.LVBytes]
    ],
    "getEui64": [38, [],
        [t.EmberEUI64]
    ],
    "getNodeId": [39, [],
        [t.EmberNodeId]
    ],
    "networkInit": [23, [],
        [t.EmberStatus]
    ],
    "setManufacturerCode": [21, [t.uint16_t],
        []
    ],
    "setPowerDescriptor": [22, [t.uint16_t],
        []
    ],
    "networkInitExtended": [112, [t.EmberNetworkInitStruct],
        [t.EmberStatus]
    ],
    "networkState": [24, [],
        [t.EmberNetworkStatus]
    ],
    "stackStatusHandler": [25, [],
        [t.EmberStatus]
    ],
    "startScan": [26, [t.EzspNetworkScanType, t.uint32_t, t.uint8_t],
        [t.EmberStatus]
    ],
    "energyScanResultHandler": [72, [],
        [t.uint8_t, t.int8s]
    ],
    "networkFoundHandler": [27, [],
        [t.EmberZigbeeNetwork, t.uint8_t, t.int8s]
    ],
    "scanCompleteHandler": [28, [],
        [t.uint8_t, t.EmberStatus]
    ],
    "stopScan": [29, [],
        [t.EmberStatus]
    ],
    "formNetwork": [30, [t.EmberNetworkParameters],
        [t.EmberStatus]
    ],
    "joinNetwork": [31, [t.EmberNodeType, t.EmberNetworkParameters],
        [t.EmberStatus]
    ],
    "leaveNetwork": [32, [],
        [t.EmberStatus]
    ],
    "findAndRejoinNetwork": [33, [t.Bool, t.uint32_t],
        [t.EmberStatus]
    ],
    "permitJoining": [34, [t.uint8_t],
        [t.EmberStatus]
    ],
    "childJoinHandler": [35, [],
        [t.uint8_t, t.Bool, t.EmberNodeId, t.EmberEUI64, t.EmberNodeType]
    ],
    "energyScanRequest": [156, [t.EmberNodeId, t.uint32_t, t.uint8_t, t.uint16_t],
        [t.EmberStatus]
    ],
    "getNetworkParameters": [40, [],
        [t.EmberStatus, t.EmberNodeType, t.EmberNetworkParameters]
    ],
    "getParentChildParameters": [41, [],
        [t.uint8_t, t.EmberEUI64, t.EmberNodeId]
    ],
    "getChildData": [74, [t.uint8_t],
        [t.EmberStatus, t.EmberNodeId, t.EmberEUI64, t.EmberNodeType]
    ],
    "getNeighbor": [121, [t.uint8_t],
        [t.EmberStatus, t.EmberNeighborTableEntry]
    ],
    "neighborCount": [122, [],
        [t.uint8_t]
    ],
    "getRouteTableEntry": [123, [t.uint8_t],
        [t.EmberStatus, t.EmberRouteTableEntry]
    ],
    "setRadioPower": [153, [t.int8s],
        [t.EmberStatus]
    ],
    "setRadioChannel": [154, [t.uint8_t],
        [t.EmberStatus]
    ],
    "setConcentrator": [16, [t.Bool, t.uint16_t, t.uint16_t, t.uint16_t, t.uint8_t, t.uint8_t, t.uint8_t],
        [t.EmberStatus]
    ],
    "clearBindingTable": [42, [],
        [t.EmberStatus]
    ],
    "setBinding": [43, [t.uint8_t, t.EmberBindingTableEntry],
        [t.EmberStatus]
    ],
    "getBinding": [44, [t.uint8_t],
        [t.EmberStatus, t.EmberBindingTableEntry]
    ],
    "deleteBinding": [45, [t.uint8_t],
        [t.EmberStatus]
    ],
    "bindingIsActive": [46, [t.uint8_t],
        [t.Bool]
    ],
    "getBindingRemoteNodeId": [47, [t.uint8_t],
        [t.EmberNodeId]
    ],
    "setBindingRemoteNodeId": [48, [t.uint8_t],
        []
    ],
    "remoteSetBindingHandler": [49, [],
        [t.EmberBindingTableEntry]
    ],
    "remoteDeleteBindingHandler": [50, [],
        [t.uint8_t, t.EmberStatus]
    ],
    "maximumPayloadLength": [51, [],
        [t.uint8_t]
    ],
    "sendUnicast": [52, [t.EmberOutgoingMessageType, t.EmberNodeId, t.EmberApsFrame, t.uint8_t, t.LVBytes],
        [t.EmberStatus, t.uint8_t]
    ],
    "sendBroadcast": [54, [t.EmberNodeId, t.EmberApsFrame, t.uint8_t, t.uint8_t, t.LVBytes],
        [t.EmberStatus, t.uint8_t]
    ],
    "proxyBroadcast": [55, [t.EmberNodeId, t.EmberNodeId, t.uint8_t, t.EmberApsFrame, t.uint8_t, t.uint8_t, t.LVBytes],
        [t.EmberStatus, t.uint8_t]
    ],
    "sendMulticast": [56, [t.EmberApsFrame, t.uint8_t, t.uint8_t, t.uint8_t, t.LVBytes],
        [t.EmberStatus, t.uint8_t]
    ],
    "sendReply": [57, [t.EmberNodeId, t.EmberApsFrame, t.LVBytes],
        [t.EmberStatus]
    ],
    "messageSentHandler": [63, [],
        [t.EmberOutgoingMessageType, t.uint16_t, t.EmberApsFrame, t.uint8_t, t.EmberStatus, t.LVBytes]
    ],
    "sendManyToOneRouteRequest": [65, [t.uint16_t, t.uint8_t],
        [t.EmberStatus]
    ],
    "pollForData": [66, [t.uint16_t, t.EmberEventUnits, t.uint8_t],
        [t.EmberStatus]
    ],
    "pollCompleteHandler": [67, [],
        [t.EmberStatus]
    ],
    "pollHandler": [68, [],
        [t.EmberNodeId]
    ],
    "incomingSenderEui64Handler": [98, [],
        [t.EmberEUI64]
    ],
    "incomingMessageHandler": [69, [],
        [t.EmberIncomingMessageType, t.EmberApsFrame, t.uint8_t, t.int8s, t.EmberNodeId, t.uint8_t, t.uint8_t, t.LVBytes]
    ],
    "incomingRouteRecordHandler": [89, [],
        [t.EmberNodeId, t.EmberEUI64, t.uint8_t, t.int8s, t.LVBytes]
    ],
    "incomingManyToOneRouteRequestHandler": [125, [],
        [t.EmberNodeId, t.EmberEUI64, t.uint8_t]
    ],
    "incomingRouteErrorHandler": [128, [],
        [t.EmberStatus, t.EmberNodeId]
    ],
    "addressTableEntryIsActive": [91, [t.uint8_t],
        [t.Bool]
    ],
    "setAddressTableRemoteEui64": [92, [t.uint8_t, t.EmberEUI64],
        [t.EmberStatus]
    ],
    "setAddressTableRemoteNodeId": [93, [t.uint8_t, t.EmberNodeId],
        []
    ],
    "getAddressTableRemoteEui64": [94, [t.uint8_t],
        [t.EmberEUI64]
    ],
    "getAddressTableRemoteNodeId": [95, [t.uint8_t],
        [t.EmberNodeId]
    ],
    "setExtendedTimeout": [126, [t.EmberEUI64, t.Bool],
        []
    ],
    "getExtendedTimeout": [127, [t.EmberEUI64],
        [t.Bool]
    ],
    "replaceAddressTableEntry": [130, [t.uint8_t, t.EmberEUI64, t.EmberNodeId, t.Bool],
        [t.EmberStatus, t.EmberEUI64, t.EmberNodeId, t.Bool]
    ],
    "lookupNodeIdByEui64": [96, [t.EmberEUI64],
        [t.EmberNodeId]
    ],
    "lookupEui64ByNodeId": [97, [t.EmberNodeId],
        [t.EmberStatus, t.EmberEUI64]
    ],
    "getMulticastTableEntry": [99, [t.uint8_t],
        [t.EmberStatus, t.EmberMulticastTableEntry]
    ],
    "setMulticastTableEntry": [100, [t.uint8_t, t.EmberMulticastTableEntry],
        [t.EmberStatus]
    ],
    "idConflictHandler": [124, [],
        [t.EmberNodeId]
    ],
    "sendRawMessage": [150, [t.LVBytes],
        [t.EmberStatus]
    ],
    "macPassthroughMessageHandler": [151, [],
        [t.EmberMacPassthroughType, t.uint8_t, t.int8s, t.LVBytes]
    ],
    "macFilterMatchMessageHandler": [70, [],
        [t.uint8_t, t.EmberMacPassthroughType, t.uint8_t, t.int8s, t.LVBytes]
    ],
    "rawTransmitCompleteHandler": [152, [],
        [t.EmberStatus]
    ],
    "setInitialSecurityState": [104, [t.EmberInitialSecurityState],
        [t.EmberStatus]
    ],
    "getCurrentSecurityState": [105, [],
        [t.EmberStatus, t.EmberCurrentSecurityState]
    ],
    "getKey": [106, [t.EmberKeyType],
        [t.EmberStatus, t.EmberKeyStruct]
    ],
    "switchNetworkKeyHandler": [110, [],
        [t.uint8_t]
    ],
    "getKeyTableEntry": [113, [t.uint8_t],
        [t.EmberStatus, t.EmberKeyStruct]
    ],
    "setKeyTableEntry": [114, [t.uint8_t, t.EmberEUI64, t.Bool, t.EmberKeyData],
        [t.EmberStatus]
    ],
    "findKeyTableEntry": [117, [t.EmberEUI64, t.Bool],
        [t.uint8_t]
    ],
    "addOrUpdateKeyTableEntry": [102, [t.EmberEUI64, t.Bool, t.EmberKeyData],
        [t.EmberStatus]
    ],
    "eraseKeyTableEntry": [118, [t.uint8_t],
        [t.EmberStatus]
    ],
    "clearKeyTable": [177, [],
        [t.EmberStatus]
    ],
    "requestLinkKey": [20, [t.EmberEUI64],
        [t.EmberStatus]
    ],
    "zigbeeKeyEstablishmentHandler": [155, [],
        [t.EmberEUI64, t.EmberKeyStatus]
    ],
    "addTransientLinkKey": [175, [t.EmberEUI64, t.EmberKeyData],
        [t.EmberStatus]
    ],
    "clearTransientLinkKeys": [107, [],
        []
    ],
    "setSecurityKey": [202, [t.EmberKeyData, t.SecureEzspSecurityType],
        [t.EzspStatus]
    ],
    "setSecurityParameters": [203, [t.SecureEzspSecurityLevel, t.SecureEzspRandomNumber],
        [t.EzspStatus, t.SecureEzspRandomNumber]
    ],
    "resetToFactoryDefaults": [204, [],
        [t.EzspStatus]
    ],
    "getSecurityKeyStatus": [205, [],
        [t.EzspStatus, t.SecureEzspSecurityType]
    ],
    "trustCenterJoinHandler": [36, [],
        [t.EmberNodeId, t.EmberEUI64, t.EmberDeviceUpdate, t.EmberJoinDecision, t.EmberNodeId]
    ],
    "broadcastNextNetworkKey": [115, [t.EmberKeyData],
        [t.EmberStatus]
    ],
    "broadcastNetworkKeySwitch": [116, [],
        [t.EmberStatus]
    ],
    "becomeTrustCenter": [119, [t.EmberKeyData],
        [t.EmberStatus]
    ],
    "aesMmoHash": [111, [t.EmberAesMmoHashContext, t.Bool, t.LVBytes],
        [t.EmberStatus, t.EmberAesMmoHashContext]
    ],
    "removeDevice": [168, [t.EmberNodeId, t.EmberEUI64, t.EmberEUI64],
        [t.EmberStatus]
    ],
    "unicastNwkKeyUpdate": [169, [t.EmberNodeId, t.EmberEUI64, t.EmberKeyData],
        [t.EmberStatus]
    ],
    "generateCbkeKeys": [164, [],
        [t.EmberStatus]
    ],
    "generateCbkeKeysHandler": [158, [],
        [t.EmberStatus, t.EmberPublicKeyData]
    ],
    "calculateSmacs": [159, [t.Bool, t.EmberCertificateData, t.EmberPublicKeyData],
        [t.EmberStatus]
    ],
    "calculateSmacsHandler": [160, [],
        [t.EmberStatus, t.EmberSmacData, t.EmberSmacData]
    ],
    "generateCbkeKeys283k1": [232, [],
        [t.EmberStatus]
    ],
    "generateCbkeKeysHandler283k1": [233, [],
        [t.EmberStatus, t.EmberPublicKey283k1Data]
    ],
    "calculateSmacs283k1": [234, [t.Bool, t.EmberCertificate283k1Data, t.EmberPublicKey283k1Data],
        [t.EmberStatus]
    ],
    "calculateSmacsHandler283k1": [235, [],
        [t.EmberStatus, t.EmberSmacData, t.EmberSmacData]
    ],
    "clearTemporaryDataMaybeStoreLinkKey": [161, [t.Bool],
        [t.EmberStatus]
    ],
    "clearTemporaryDataMaybeStoreLinkKey283k1": [238, [t.Bool],
        [t.EmberStatus]
    ],
    "getCertificate": [165, [],
        [t.EmberStatus, t.EmberCertificateData]
    ],
    "getCertificate283k1": [236, [],
        [t.EmberStatus, t.EmberCertificate283k1Data]
    ],
    "dsaSign": [166, [t.LVBytes],
        [t.EmberStatus]
    ],
    "dsaSignHandler": [167, [],
        [t.EmberStatus, t.LVBytes]
    ],
    "dsaVerify": [163, [t.EmberMessageDigest, t.EmberCertificateData, t.EmberSignatureData],
        [t.EmberStatus]
    ],
    "dsaVerifyHandler": [120, [],
        [t.EmberStatus]
    ],
    "dsaVerify283k1": [176, [t.EmberMessageDigest, t.EmberCertificate283k1Data, t.EmberSignature283k1Data],
        [t.EmberStatus]
    ],
    "setPreinstalledCbkeData": [162, [t.EmberPublicKeyData, t.EmberCertificateData, t.EmberPrivateKeyData],
        [t.EmberStatus]
    ],
    "setPreinstalledCbkeData283k1": [237, [t.EmberPublicKey283k1Data, t.EmberCertificate283k1Data, t.EmberPrivateKey283k1Data],
        [t.EmberStatus]
    ],
    "mfglibStart": [131, [t.Bool],
        [t.EmberStatus]
    ],
    "mfglibEnd": [132, [],
        [t.EmberStatus]
    ],
    "mfglibStartTone": [133, [],
        [t.EmberStatus]
    ],
    "mfglibStopTone": [134, [],
        [t.EmberStatus]
    ],
    "mfglibStartStream": [135, [],
        [t.EmberStatus]
    ],
    "mfglibStopStream": [136, [],
        [t.EmberStatus]
    ],
    "mfglibSendPacket": [137, [t.LVBytes],
        [t.EmberStatus]
    ],
    "mfglibSetChannel": [138, [t.uint8_t],
        [t.EmberStatus]
    ],
    "mfglibGetChannel": [139, [],
        [t.uint8_t]
    ],
    "mfglibSetPower": [140, [t.uint16_t, t.int8s],
        [t.EmberStatus]
    ],
    "mfglibGetPower": [141, [],
        [t.int8s]
    ],
    "mfglibRxHandler": [142, [],
        [t.uint8_t, t.int8s, t.LVBytes]
    ],
    "launchStandaloneBootloader": [143, [t.uint8_t],
        [t.EmberStatus]
    ],
    "sendBootloadMessage": [144, [t.Bool, t.EmberEUI64, t.LVBytes],
        [t.EmberStatus]
    ],
    "getStandaloneBootloaderVersionPlatMicroPhy": [145, [],
        [t.uint16_t, t.uint8_t, t.uint8_t, t.uint8_t]
    ],
    "incomingBootloadMessageHandler": [146, [],
        [t.EmberEUI64, t.uint8_t, t.int8s, t.LVBytes]
    ],
    "bootloadTransmitCompleteHandler": [147, [],
        [t.EmberStatus, t.LVBytes]
    ],
    "aesEncrypt": [148, [t.fixed_list(16, t.uint8_t), t.fixed_list(16, t.uint8_t)],
        [t.fixed_list(16, t.uint8_t)]
    ],
    "overrideCurrentChannel": [149, [t.uint8_t],
        [t.EmberStatus]
    ],
    "zllNetworkOps": [178, [t.EmberZllNetwork, t.EzspZllNetworkOperation, t.int8s],
        [t.EmberStatus]
    ],
    "zllSetInitialSecurityState": [179, [t.EmberKeyData, t.EmberZllInitialSecurityState],
        [t.EmberStatus]
    ],
    "zllStartScan": [180, [t.uint32_t, t.int8s, t.EmberNodeType],
        [t.EmberStatus]
    ],
    "zllSetRxOnWhenIdle": [181, [t.uint16_t],
        [t.EmberStatus]
    ],
    "zllNetworkFoundHandler": [182, [],
        [t.EmberZllNetwork, t.Bool, t.EmberZllDeviceInfoRecord, t.uint8_t, t.int8s]
    ],
    "zllScanCompleteHandler": [183, [],
        [t.EmberStatus]
    ],
    "zllAddressAssignmentHandler": [184, [],
        [t.EmberZllAddressAssignment, t.uint8_t, t.int8s]
    ],
    "setLogicalAndRadioChannel": [185, [t.uint8_t],
        [t.EmberStatus]
    ],
    "getLogicalChannel": [186, [],
        [t.uint8_t]
    ],
    "zllTouchLinkTargetHandler": [187, [],
        [t.EmberZllNetwork]
    ],
    "zllGetTokens": [188, [],
        [t.EmberTokTypeStackZllData, t.EmberTokTypeStackZllSecurity]
    ],
    "zllSetDataToken": [189, [t.EmberTokTypeStackZllData],
        []
    ],
    "zllSetNonZllNetwork": [191, [],
        []
    ],
    "isZllNetwork": [190, [],
        [t.Bool]
    ],
    "rf4ceSetPairingTableEntry": [208, [t.uint8_t, t.EmberRf4cePairingTableEntry],
        [t.EmberStatus]
    ],
    "rf4ceGetPairingTableEntry": [209, [t.uint8_t],
        [t.EmberStatus, t.EmberRf4cePairingTableEntry]
    ],
    "rf4ceDeletePairingTableEntry": [210, [t.uint8_t],
        [t.EmberStatus]
    ],
    "rf4ceKeyUpdate": [211, [t.uint8_t, t.EmberKeyData],
        [t.EmberStatus]
    ],
    "rf4ceSend": [212, [t.uint8_t, t.uint8_t, t.uint16_t, t.EmberRf4ceTxOption, t.uint8_t, t.LVBytes],
        [t.EmberStatus]
    ],
    "rf4ceIncomingMessageHandler": [213, [],
        [t.uint8_t, t.uint8_t, t.uint16_t, t.EmberRf4ceTxOption, t.LVBytes]
    ],
    "rf4ceMessageSentHandler": [214, [],
        [t.EmberStatus, t.uint8_t, t.EmberRf4ceTxOption, t.uint8_t, t.uint16_t, t.uint8_t, t.LVBytes]
    ],
    "rf4ceStart": [215, [t.EmberRf4ceNodeCapabilities, t.EmberRf4ceVendorInfo, t.int8s],
        [t.EmberStatus]
    ],
    "rf4ceStop": [216, [],
        [t.EmberStatus]
    ],
    "rf4ceDiscovery": [217, [t.EmberPanId, t.EmberNodeId, t.uint8_t, t.uint16_t, t.LVBytes],
        [t.EmberStatus]
    ],
    "rf4ceDiscoveryCompleteHandler": [218, [],
        [t.EmberStatus]
    ],
    "rf4ceDiscoveryRequestHandler": [219, [],
        [t.EmberEUI64, t.uint8_t, t.EmberRf4ceVendorInfo, t.EmberRf4ceApplicationInfo, t.uint8_t, t.uint8_t]
    ],
    "rf4ceDiscoveryResponseHandler": [220, [],
        [t.Bool, t.uint8_t, t.EmberPanId, t.EmberEUI64, t.uint8_t, t.EmberRf4ceVendorInfo, t.EmberRf4ceApplicationInfo, t.uint8_t, t.uint8_t]
    ],
    "rf4ceEnableAutoDiscoveryResponse": [221, [t.uint16_t],
        [t.EmberStatus]
    ],
    "rf4ceAutoDiscoveryResponseCompleteHandler": [222, [],
        [t.EmberStatus, t.EmberEUI64, t.uint8_t, t.EmberRf4ceVendorInfo, t.EmberRf4ceApplicationInfo, t.uint8_t]
    ],
    "rf4cePair": [223, [t.uint8_t, t.EmberPanId, t.EmberEUI64, t.uint8_t],
        [t.EmberStatus]
    ],
    "rf4cePairCompleteHandler": [224, [],
        [t.EmberStatus, t.uint8_t, t.EmberRf4ceVendorInfo, t.EmberRf4ceApplicationInfo]
    ],
    "rf4cePairRequestHandler": [225, [],
        [t.EmberStatus, t.uint8_t, t.EmberEUI64, t.uint8_t, t.EmberRf4ceVendorInfo, t.EmberRf4ceApplicationInfo, t.uint8_t]
    ],
    "rf4ceUnpair": [226, [t.uint8_t],
        [t.EmberStatus]
    ],
    "rf4ceUnpairHandler": [227, [],
        [t.uint8_t]
    ],
    "rf4ceUnpairCompleteHandler": [228, [],
        [t.uint8_t]
    ],
    "rf4ceSetPowerSavingParameters": [229, [t.uint32_t, t.uint32_t],
        [t.EmberStatus]
    ],
    "rf4ceSetFrequencyAgilityParameters": [230, [t.uint8_t, t.uint8_t, t.int8s, t.uint16_t, t.uint8_t],
        [t.EmberStatus]
    ],
    "rf4ceSetApplicationInfo": [231, [t.EmberRf4ceApplicationInfo],
        [t.EmberStatus]
    ],
    "rf4ceGetApplicationInfo": [239, [],
        [t.EmberStatus, t.EmberRf4ceApplicationInfo]
    ],
    "rf4ceGetMaxPayload": [243, [t.uint8_t, t.EmberRf4ceTxOption],
        [t.uint8_t]
    ],
    "rf4ceGetNetworkParameters": [244, [],
        [t.EmberStatus, t.EmberNodeType, t.EmberNetworkParameters]
    ],
    "gpProxyTableProcessGpPairing": [201, [t.uint32_t, t.EmberGpAddress, t.uint8_t, t.uint16_t, t.uint16_t, t.uint16_t, t.fixed_list(8, t.uint8_t), t.EmberKeyData],
        []
    ],
    "dGpSend": [198, [t.Bool, t.Bool, t.EmberGpAddress, t.uint8_t, t.LVBytes, t.uint8_t, t.uint16_t],
        [t.EmberStatus]
    ],
    "dGpSentHandler": [199, [],
        [t.EmberStatus, t.uint8_t]
    ],
    "gpepIncomingMessageHandler": [197, [],
        [t.EmberStatus, t.uint8_t, t.uint8_t, t.EmberGpAddress, t.EmberGpSecurityLevel, t.EmberGpKeyType, t.Bool, t.Bool, t.uint32_t, t.uint8_t, t.uint32_t, t.EmberGpSinkListEntry, t.LVBytes]
    ]
};

//# sourceMappingURL=commands.js.map
