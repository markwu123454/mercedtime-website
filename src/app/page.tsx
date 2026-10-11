const STORE_URL =
  "https://chromewebstore.google.com/detail/hjppipajfmgbkocbjejafmmdommjbnpg?utm_source=mercedtime-website";

export default function Home() {
  return (
    <main>
      <div className="brand">Merced<span>Time</span></div>
      <h1>UC Merced course lookup and planning, overhauled.</h1>
      <p>
        A Chrome extension that replaces UC Merced’s registration pages: class search, schedules and degree
        progress in one place. It is an independent student project and is not affiliated with the University of
        California, Merced.
      </p>
      <p>
        <a href={STORE_URL}>Get it on the Chrome Web Store</a>
      </p>
      <p>
        <a href="/privacy">Privacy policy</a> · <a href="/terms">Terms of use</a>
      </p>
    </main>
  );
}
