import { ControllerApplication } from './application';
import { EmberApsFrame } from './types/struct';
import { EmberApsOption } from './types/named';

const application = new ControllerApplication();

application.on('incomingMessage', ({ apsFrame, sender, message }: { apsFrame: EmberApsFrame, sender: number, message: Buffer }) => {
  console.log('incomingMessage', sender, apsFrame, message);
});

application.startup('/dev/ttyUSB1', {
  baudRate: 57600,
  parity: 'none',
  stopBits: 1,
  xon: true,
  xoff: true
}).then(async () => {
  
  let localEui64 = application.getLocalIEEE64Address();
  console.log('Local Eui64:', localEui64);
  
  var res = await application.request(0xA329, {
    clusterId: 0x11, profileId: 0xC105,
    sequence: 1,
    sourceEndpoint: 0xE8, destinationEndpoint: 0xE8,
    options: EmberApsOption.APS_OPTION_FORCE_ROUTE_DISCOVERY | EmberApsOption.APS_OPTION_RETRY
  }, Buffer.from('\nTESTING!\n'), 0);

  console.log('Sent=', res);
});


