// src/api/musicApi.ts

const BASE_URL = "https://moody-blue-597542124573.asia-southeast2.run.app/api/music/preview";

export interface Mood {
  mood: string;
  name: string;
  confidence: number;
}

export interface SongPreview {
  _id: string;
  track_id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  mp3_url: string;
  image_url: string;
  release_date: string;
  moods: Mood[];
}

export interface SearchResponse {
  preview: SongPreview[];
}

// Hàm tìm kiếm bài hát theo keyword
 const searchSongsByKeyword = async (
  keyword: string,
  limit: number 
): Promise<SongPreview[]> => {
  if (!keyword.trim()) {
    return [];
  }

  try {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${BASE_URL}/name?keyword=${encodedKeyword}&numberOfsong=${limit}`;
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchResponse = await response.json();
    return data.preview || [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    // Bạn có thể throw error để xử lý ở component, hoặc return [] để silent fail
    return [];
    // throw error; // Nếu muốn component bắt lỗi bằng try-catch
  }
};
export default searchSongsByKeyword;