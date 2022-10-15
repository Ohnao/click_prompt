import { Component, createSignal, For, onMount, Show, Switch } from "solid-js";
import styles from "./App.module.css";

const App: Component = () => {
  const [images, setImages] = createSignal<string[]>([]);
  const [prompt, setPrompt] = createSignal("天空の城");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    fetchImages();
  };

  const fetchImages = async () => {
    setLoading(true);
    console.log("before", prompt());
    const resBody = await fetch("http://localhost:3001/textToImage", {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt(),
      }),
    }).then((res) => {
      return res.json();
    });
    const newImages = resBody.images[0];
    setImages(newImages);
    setLoading(false);
  };

  onMount(() => {
    const prompt = location.search.split("prompt=")[1];
    if (prompt) {
      setPrompt(decodeURIComponent(prompt));
      fetchImages();
    }
  });

  return (
    <div class="container">
      <h1 class="title">QuickPrompt</h1>
      <div class="content">
        <form
          classList={{ "form-group": true, loading: loading() }}
          onSubmit={handleSubmit}
        >
          <input
            placeholder="prompt..."
            class="group-input"
            onChange={(e) => setPrompt(e.currentTarget.value)}
            type="text"
            id="prompt"
            value={prompt()}
            disabled={loading()}
          />
          <button class="group-button" type="submit" disabled={loading()}>
            <Show fallback="GENERATE" when={loading()}>
              GENERATING...
            </Show>
          </button>
        </form>
      </div>
      <div classList={{ images: true, loading: loading() }}>
        <For each={images()}>
          {(data) => (
            <div class="image-wrap">
              <img class="image" src={data} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
