import axios from "axios";
import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/toast";
import { formatTimeAgo } from "@/utils/dateUtils";
import { useTranslation } from "react-i18next";
import PageLoader from "@/components/loaders/PageLoader";
import NewsCard from "../NewsCard";
import { useLanguage } from "@/context/LanguageContext";

const ITEMS_PER_PAGE = 10;
const CATEGORIES = [
  {
    slug: "tourism",
    title: "Tourism",
  },
  {
    slug: "lifestyle",
    title: "Lifestyle",
  },
  {
    slug: "food",
    title: "Food",
  },
  {
    slug: "business",
    title: "Business",
  },
  {
    slug: "environment",
    title: "Environment",
  },
  {
    slug: "visa-immigration",
    title: "Visa & Immigration",
  },
];

const NewsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState("tourism");
  const [news, setNews] = useState([]);
  //   const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  //   const observer = useRef();
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const fetchNews = async (selectedCategory) => {
    try {
      let url;

      if (selectedCategory === "visa-immigration") {
        url = `https://newsdata.io/api/1/latest?apikey=pub_84796f743a995aebf6c5d1005d17bcd56aadb&country=de&q=visa%20and%20immigration&language=${selectedLanguage.code.slice(
          0,
          2
        )}&size=${ITEMS_PER_PAGE}`;
      } else {
        url = `https://newsdata.io/api/1/news?apikey=pub_84796f743a995aebf6c5d1005d17bcd56aadb&country=de&category=${selectedCategory}&language=${selectedLanguage.code.slice(
          0,
          2
        )}&size=${ITEMS_PER_PAGE}`;
      }
      setLoading(true);
      const response = await axios.get(url);

      if (response.data.status === "success") {
        setNews(response.data.results);
        setSelectedCategory(selectedCategory);
        // setHasMore(response.data.totalResults > ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      showToast({
        message: t("userDashboard.news.failed"),
        type: "error",
      });
    } finally {
      setSelectedCategory(selectedCategory);
      setLoading(false);
      // setHasMore(response.data.totalResults > ITEMS_PER_PAGE);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await fetchNews(selectedCategory);
    }
    fetchData();
  }, [selectedLanguage, selectedCategory]);

  //   const lastNewsRef = useCallback(
  //     (node) => {
  //       if (loading) return;
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPage((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [loading, hasMore]
  //   );

  if (loading) {
    return <PageLoader />;
  }

  const newsHeader = (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
      <h2 className="text-lg font-medium capitalize">
        {
          CATEGORIES.find((category) => category.slug === selectedCategory)
            ?.title
        }{" "}
        {t("userDashboard.news.title")} in Germany
      </h2>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-3xl capitalize text-sm ${
              selectedCategory === category.slug
                ? "bg-[#C2DFFA]"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={async () => await fetchNews(category.slug)}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );

  if (!loading && news.length === 0) {
    return (
      <div className="w-full">
        {newsHeader}
        <div className="flex flex-col items-center justify-center h-[45vh]">
          <i className="fal fa-newspaper mb-4" style={{ fontSize: "36px" }}></i>
          <p className="text-gray-600">{t("userDashboard.news.noNews")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {newsHeader}

      <div className="w-full bg-[#F8F7F7] rounded-2xl">
        {news.map((newsItem, index) => (
          <div
            key={newsItem.article_id}
            //   ref={index === news.length - 1 ? lastNewsRef : null}
          >
            <NewsCard
              id={newsItem.article_id}
              data={{
                timeAgo: formatTimeAgo(newsItem.pubDate),
                title: newsItem.title,
                link: newsItem.link,
                image: newsItem.image_url,
                source: newsItem.source_name,
                category: newsItem.category[0],
                language: newsItem.language,
                country: newsItem.country[0],
              }}
              isLast={index === news.length - 1}
              isFirst={index === 0}
            />
          </div>
        ))}

        {/* {!loading && hasMore && (
        <button
          onClick={fetchNews}
          className="w-full py-3 text-center text-gray-600 hover:text-gray-900 transition-colors border-t border-[#D4D4D4]"
        >
          {t("userDashboard.notifications.showMore")}
        </button>
      )} */}
      </div>
    </div>
  );
};

export default NewsTab;
