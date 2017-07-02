import { Ezsp } from './ezsp';
import { EzspConfigId, EmberZdoConfigurationFlags } from './types';


const ezsp = new Ezsp();
ezsp.connect('/dev/ttyUSB1', {
  baudRate: 57600,
  parity: 'none',
  stopBits: 1,
  xon: true,
  xoff: true
}).then(async () => {
  console.log('successfully connected');
  const version = await ezsp.version();
  console.log('Got version', version);

  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_STACK_PROFILE, 2);
  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_SECURITY_LEVEL, 5);
  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_SUPPORTED_NETWORKS, 1);
  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_APPLICATION_ZDO_FLAGS, 
              EmberZdoConfigurationFlags.APP_RECEIVES_SUPPORTED_ZDO_REQUESTS 
              | EmberZdoConfigurationFlags.APP_HANDLES_UNSUPPORTED_ZDO_REQUESTS);
  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_TRUST_CENTER_ADDRESS_CACHE_SIZE, 2);
  await ezsp.setConfigurationValue(EzspConfigId.CONFIG_PACKET_BUFFER_COUNT, 0xff);

  if (await ezsp.networkInit()) {
    console.log('Network ready');

    ezsp.add_callback((frameName:any, ...args: any[])=>{
        console.log('incoming frame', frameName, args);
    })
  } else {
    const state = await ezsp.execCommand('networkState');
    console.log('Network state', state);
  }
})

