export const youtubeCommand = {
  name: "youtube",
  icon: () => (
    <span role="img" aria-label="nice">
      📹
    </span>
  ),
  execute: (opts) => {
    opts.textApi.replaceSelection("![youtube video](http://www.youtube.com/watch?v=dQw4w9WgXcQ)");
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

export const options = [
  "public_id",
  "description",
  "assigned_users",
  "task_activity",
  "labels",
  "created_by",
  "status",
  "updated_at",
  "public_id",
  "created_at",
  "list_id",
  "name",
  "deleted_at",
  "image",
  "assigned_users",
  "id",
  "comments",
];
