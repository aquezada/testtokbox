import React from 'react';
import { OTPublisher } from 'opentok-react';
import axios from 'axios';
import CheckBox from './CheckBox';
import config from '../config';

class Publisher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
      videoSource: 'camera'
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  transcodingOn = () => {
    const data = {
      "sessionId": config.SESSION_ID,
      // "layout": {
      //   "type": "custom",
      //   "stylesheet": "the layout stylesheet (only used with type == custom)",
      //   "screenshareType": "optional layout type to use when there is a screen-sharing stream"
      // },
      "maxDuration": 5400,
      "outputs": {
        "hls": {},
        "rtmp": [{
          "id": "foo",
          "serverUrl": "rtmp://a.rtmp.youtube.com/live2/fc8m-tyay-zj3v-ttwg-44af",
          "streamName": "Youtube test"
        }]
      },
      "resolution": "640x480"
    }
    axios
    .post('https://thingproxy.freeboard.io/fetch/https://api.opentok.com/v2/project/47179364/broadcast', data, {
      headers: {
        'Access-Control-Allow-Origin': true,
      },
    })
    .then((result) => {
      console.log('result', result);
      // setProgress(i);
      // resolve(result);
    })
    .catch((error) => {
      console.log('error', error);
      // reject(error);
    });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  changeVideoSource = (videoSource) => {
    (this.state.videoSource !== 'camera') ? this.setState({videoSource: 'camera'}) : this.setState({ videoSource: 'screen' })
  }

  onError = (err) => {
    this.setState({ error: `Failed to publish: ${err.message}` });
  }

  render() {
    return (
      <div className="publisher">
        Publisher

        {this.state.error ? <div id="error">{this.state.error}</div> : null}

        <OTPublisher
          properties={{
            publishAudio: this.state.audio,
            publishVideo: this.state.video,
            videoSource: this.state.videoSource === 'screen' ? 'screen' : undefined
          }}
          onError={this.onError}
        />

        <button onClick={this.transcodingOn}>ON</button>

        <CheckBox
          label="Share Screen"
          onChange={this.changeVideoSource}
        />

        <CheckBox
          label="Publish Audio"
          initialChecked={this.state.audio}
          onChange={this.setAudio}
        />

        <CheckBox
          label="Publish Video"
          initialChecked={this.state.video}
          onChange={this.setVideo}
        />

      </div>
    );
  }
}
export default Publisher;
