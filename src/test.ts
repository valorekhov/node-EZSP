import { ControllerApplication } from './application';
import { EmberApsFrame } from './types/struct';

const application = new ControllerApplication();

application.on('incomingMessage', ({apsFrame, sender, message}:{apsFrame:EmberApsFrame, sender: number, message: Buffer}) => {
  console.log('incomingMessage', sender, apsFrame, message);
});

application.startup('/dev/ttyUSB1', {
  baudRate: 57600,
  parity: 'none',
  stopBits: 1,
  xon: true,
  xoff: true
}).then(()=>{
  //application
});


