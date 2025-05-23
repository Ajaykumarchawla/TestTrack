import staticIndex from "../mcqs/index.json"; // vite-plugin-singlefile inlines this

export async function getTestOptions() {
  const isStatic = location.protocol === "file:";
  if (isStatic) {
    return staticIndex.map((item) => ({
      label: item.name.replace(/\//g, " - "),
      value: item.path,
    }));
  } else {
    const res = await fetch("/mcqs/index.json");
    const data = await res.json();
    return data.map((item) => ({
      label: item.name.replace(/\//g, " - "),
      value: item.path,
    }));
  }
}
export function formatTestData(data) {
  return data.sort((a, b) => a.label.localeCompare(b.label));
}
