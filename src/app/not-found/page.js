import { notFound } from "next/navigation";

export const metadata = {
  title: "Page Not Found | Aliwvide",
  robots: {
    index: false,
    follow: false
  }
};

export default function CatchAllPage() {
  notFound();
}