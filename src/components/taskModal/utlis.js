export const youtubeCommand = {
  name: "youtube",
  icon: () => (
    <span role="img" aria-label="nice">
      📹
    </span>
  ),
  execute: (opts) => {
    opts.textApi.replaceSelection("![youtube video](http://www.youtube.com/watch?v=dQw4w9WgXcQ =200x200)");
  },
};

export const tableCommand = {
  name: "table",
  icon: () => (
    <span role="table" aria-label="table-template">
      📊
    </span>
  ),
  execute: (opts) => {
    opts.textApi.replaceSelection(`| Col 1   | Col 2|
    |======== |======|
    |**bold** | value|
    | Plain   | Value|`);
  },
};
