"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { CompanyPerIdInterface } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  companyData: CompanyPerIdInterface;
}

const CompanyPage = ({ companyData }: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5;

  const getCategoryLabel = useCallback((category: string) => {
    const words = category.split("_").map((word) => {
      if (word === "NE") return "në";
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(" ");
  }, []);

  const sortedComplaints = useMemo(() => {
    return [...companyData.company.complaints].sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return b.upVotes - a.upVotes;
      }
    });
  }, [companyData.company.complaints, sortOption]);

  // Pagination logic
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = sortedComplaints.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );
  const totalPages = Math.ceil(sortedComplaints.length / complaintsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalComplaints = companyData.company.complaints.length;
  const acceptedComplaints = companyData.company.complaints.filter(
    (c) => c.status === "ACCEPTED"
  ).length;
  const totalUpVotes = companyData.company.complaints.reduce(
    (sum, c) => sum + c.upVotes,
    0
  );

  return (
    <div className="lg:w-2/3">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab("overview");
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Vështrim i përgjithshëm
          </button>
          <button
            onClick={() => {
              setActiveTab("complaints");
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "complaints"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ankesat/Raportimet ({totalComplaints})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="bg-white shadow-md overflow-hidden p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            About {companyData.company.name}
          </h3>
          {companyData.company.description ? (
            <p className="text-gray-700">{companyData.company.description}</p>
          ) : (
            <p className="text-gray-500">
              Nuk ka informacion shtesë në dispozicion.
            </p>
          )}

          <div className="mt-8">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Statistika te shpejta
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {totalComplaints}
                </p>
                <p className="text-sm text-gray-500">Të gjitha ankesat</p>
              </div>
              <div className="bg-gray-50 shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {acceptedComplaints}
                </p>
                <p className="text-sm text-gray-500">Ankesat e verifikuara</p>
              </div>
              <div className="bg-gray-50 shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {companyData.complaintsPerMonth}
                </p>
                <p className="text-sm text-gray-500">Ankesa për muaj</p>
              </div>
              <div className="bg-gray-50 shadow-md p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {totalUpVotes}
                </p>
                <p className="text-sm text-gray-500">Të gjitha votat</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "complaints" && (
        <div className="bg-white shadow-md overflow-hidden">
          {/* Sort Options */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Ankesat/Raportimet
            </h3>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-sm text-gray-500">
                Rendit sipas:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="border-gray-300 shadow-sm px-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="newest">Më të rejat</option>
                <option value="oldest">Më të vjetrat</option>
                <option value="popular">Më së shumti vota</option>
              </select>
            </div>
          </div>

          {currentComplaints.length > 0 ? (
            <>
              <div className="divide-y divide-gray-200">
                {currentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => router.push(`/ankesat/${complaint.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {complaint.title}
                        </h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {complaint.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              complaint.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {complaint.status}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getCategoryLabel(complaint.category)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {complaint.upVotes}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Paraqitur më{" "}
                      {new Date(complaint.createdAt).toLocaleDateString("sq-AL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent style={{listStyle: "none"}}>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Nuk ka akoma ankesa
              </h3>
              <p className="mt-1 text-gray-500">
                Bëhuni i pari që raporton një ankesë për këtë kompani.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/krijo-raportim")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Raporto Ankesë
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(CompanyPage);