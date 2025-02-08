
export function useMediaControl() {
  const pauseAllMedia = () => {
    // Pause video if it exists and is playing
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });

    // Pause audio if it exists and is playing
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  };

  return { pauseAllMedia };
}
