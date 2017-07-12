import { ControllerApplication } from './application';
import { EmberApsFrame } from './types/struct';

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
  await application.request(123, {
    clusterId: 0x11, profileId: 0,
    sequence: 0,
    sourceEndpoint: 0x11, destinationEndpoint: 0x11
  }, Buffer.from('TESTING'));
  console.log('Sent!')
});


