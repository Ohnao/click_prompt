import { Component, createSignal, For } from 'solid-js';
import styles from './App.module.css';

const App: Component = () => {
  const [images, setImages] = createSignal<string[]>([])
  const [prompt, setPrompt] = createSignal("天空の城")

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    console.log("before", prompt())
    const resBody = await fetch('http://localhost:3001/textToImage', {
      method: 'POST',
      body: JSON.stringify({
        'prompt': prompt(),
      })
    }).then((res) => {
      return res.json()
    })
    const newImages = resBody.images[0]
    setImages(newImages)
  }

  return (
    <div class={styles.App}>
      <div>
        <form onSubmit={handleSubmit}>
          <input onChange={(e) => setPrompt(e.currentTarget.value)} type="text" id="prompt" value={prompt()} />
          <button type="submit">送信</button>
        </form>
      </div>
      <For each={images()}>
        {(data) => (
          <img src={data} />
        )}
      </For>
    </div >
  )
}

export default App;
