import { useState, useEffect } from "react";
import { DownloadWay, SoftwareConfigFile } from "@/types";

interface AppDownloadWays {
  [key: string]: DownloadWay;
}

interface AllDownloadWays {
  [key: string]: AppDownloadWays;
}

const useDownloadWays = () => {
  const [data, setData] = useState<AllDownloadWays | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/download-ways.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch download ways: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDownloadWays;