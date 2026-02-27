import { NextResponse } from 'next/server';

const siteData = {
  siteTitle: "Test Site",
  siteDescription: "テストサイトです"
};
const contentsData = [
  { slug: "top", title: "TOP Page", content: '<p>このページは<span style="color:red">トップページ</span>です</p>' },
  { slug: "post1", title: "テストページ1", content: '<p>このページは<span style="color:pink">テストページ1</span>です</p>' },
  { slug: "post2", title: "テストページ2", content: '<p>このページは<span style="color:green">テストページ2</span>です</p>' },
  { slug: "post3", title: "テストページ3", content: '<p>このページは<span style="color:brown">テストページ3</span>です</p>' },
  { slug: "post4", title: "テストページ4", content: '<p>このページは<span style="color:aqua">テストページ4</span>です</p>' },
  { slug: "post5", title: "テストページ5", content: '<p>このページは<span style="color:orange">テストページ5</span>です</p>' },
];

const setDate = () => {
  contentsData.forEach(c => {
    const m = Math.floor(Math.random() * 12) + 1;
    const d = Math.floor(Math.random() * 27) + 1;
    c.date = new Date(`2026/${m}/${d}`).valueOf();
  });
}
setDate();

export async function GET(req, { params }) {

  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.DATA_KEY) {
    return Response.json({ message: "invalid key" }, { status: 403 });
  }

  const path = (await params).path || [];

  const fetchDate = Date.now();

  if (path.length === 1) {
    switch (path[0]) {
      case "site":
        return Response.json({ fetchDate, data:siteData });
      case "posts":
        return Response.json({fetchDate,
          data: contentsData.filter(c => c.slug !== "top")
        });
      case "latest":
        setDate();
        return Response.json( {fetchDate,
          data:contentsData.filter(c => c.slug !== "top")
            .sort((a, b) => b.date - a.date)
            .slice(0, 3)
          });
    }
  }
  if (path.length === 2 && path[0] === "posts") {
    const slug = path[1];
    const data = contentsData.find(c => c.slug === slug);
    if (data) return Response.json({fetchDate,data});
  }

  return NextResponse.json({ message: "notfound" }, { status: 403 });
}
