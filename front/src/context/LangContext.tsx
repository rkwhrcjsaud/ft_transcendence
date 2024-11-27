import React, { createContext, useState, useContext } from "react";
import { Outlet } from "react-router-dom";

// LangContext 타입 정의
interface LangContextType {
  lang: string;
  setLang: (lang: string) => void;
}

// 기본값 설정
const defaultLang = "ko"; // 기본 언어는 영어로 설정

// Context 생성
export const LangContext = createContext<LangContextType | undefined>(undefined);

// LangProvider 컴포넌트
export const LangProvider: React.FC = ({ children }) => {
  const [lang, setLang] = useState(defaultLang);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
        <Outlet></Outlet>
    </LangContext.Provider>
  );
};

// LangContext를 사용하는 Hook
export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
};