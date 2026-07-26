import { createFileRoute } from "@tanstack/react-router";
import App from "../App.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Rukmani — A Cinematic Love Letter" },
      {
        name: "description",
        content:
          "A private, cinematic birthday experience: a locked door, a gramophone, memories, a moonlit voyage and a handwritten letter.",
      },
      { property: "og:title", content: "Happy Birthday, Rukmani — A Cinematic Love Letter" },
      {
        property: "og:description",
        content:
          "Unlock the door, pick a record, and sail through the memories. A romantic birthday website made with love.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
