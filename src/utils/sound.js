let dingEle = null;

export const ding = () => {
  if (!dingEle) {
    dingEle = document.getElementsByTagName('body')[0].appendChild(document.createElement('audio'));
    dingEle.style = 'display:none;';
    dingEle.src = './ding.mp3';
    dingEle.autoplay = true;
  } else {
    dingEle.play();
  }
};
