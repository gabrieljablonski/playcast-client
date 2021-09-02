# Library for controlling a Playcast Middleware instance

```bash
yarn add @viacast/playcast-client
```
```bash
npm i @viacast/playcast-client
```

```js
// import { Playcast } from '@viacast/playcast-client';
const { Playcast } = require('@viacast/playcast-client');

const playcast = new Playcast({ host: 'localhost', port: 8383 });

playcast.connect().then(async () => {
  const r = await playcast.append(0, { filepath: '/media/sample.mp4' });
  if (r.success) {
    await playcast.play(0);
  }
});
```
