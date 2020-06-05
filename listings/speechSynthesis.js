export const getVoices = () => {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) resolve(voices)
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices())
  })
}

export function pronounceWord (word, voice) {
  let msg = new SpeechSynthesisUtterance()
  msg.voice = voice
  msg.rate = 1
  msg.pitch = 1
  msg.volume = 1
  msg.text = word
  speechSynthesis.speak(msg)
}
