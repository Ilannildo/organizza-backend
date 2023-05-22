import axios from "axios";

interface ITopic {
  name: string;
  relevanceScore: number;
}

export async function getTopicsRelevance(topics: string[]): Promise<ITopic[]> {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageviews&titles=";
  const titles = topics.map((topic) => topic.replace(/ /g, "_")).join("|");
  const response = await axios.get(`${url}${titles}`);

  const result: ITopic[] = [];

  if (response.data && response.data.query) {
    const pages = response.data.query.pages;
    Object.keys(pages).forEach((key) => {
      const page = pages[key];
      let relevanceScore = page.pageviews
        ? Number(Object.values(page.pageviews).length)
        : 0;
      result.push({ name: page.title, relevanceScore });
    });
  }

  return result;
}
