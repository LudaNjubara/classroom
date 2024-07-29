"use client";

import { CustomModal } from "@/components/Elements";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore, useMiscStore } from "@/stores";
import { Article, ArticleType } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CreateNewArticleModal } from "./create-article";
import { ViewArticle } from "./view-article";
import { ViewArticles } from "./view-articles";

export function CommunityTab() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  // state
  const [activeTab, setActiveTab] = useState<"all" | "organization">("all");
  const [activeAlternativeTab, setActiveAlternativeTab] = useState<ArticleType>();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // hooks
  const { isOpen: isCreateNewArticleModalOpen, toggle: toggleCreateNewArticleModal } = useDisclosure();

  return (
    <div className={`${numOfModalsOpen > 0 && "h-0 overflow-hidden"}`} id="view-articles-container">
      <h2 className="text-2xl font-medium">Community</h2>
      <p className="text-slate-600">
        Welcome to the community. Here you can view articles, interact with them, and more.
      </p>

      <Separator className="my-4" />

      {/* New article button container */}
      <div className="sticky top-4 right-0 left-0 z-10 flex items-center justify-between mb-8 pr-2">
        <div className="flex gap-8">
          <ul className="flex items-center gap-2">
            <li>
              <Button
                variant="default"
                className={`rounded-full dark:bg-white/50 dark:hover:bg-white/65  ${
                  activeTab === "all" ? "dark:bg-white" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                All
              </Button>
            </li>
            {selectedOrganization && (
              <li>
                <Button
                  variant="default"
                  className={`rounded-full dark:bg-white/50 dark:hover:bg-white/65 ${
                    activeTab === "organization" ? "dark:bg-white" : ""
                  }`}
                  onClick={() => setActiveTab("organization")}
                >
                  From {selectedOrganization?.name} only
                </Button>
              </li>
            )}
          </ul>

          <Separator orientation="vertical" className="h-10 opacity-50 bg-slate-600 rounded-sm" />

          <ul className="flex items-center gap-2">
            <li>
              <Button
                variant="default"
                className={`rounded-full dark:bg-white/50 dark:hover:bg-white/65  ${
                  activeAlternativeTab === ArticleType.ARTICLE ? "dark:bg-white" : ""
                }`}
                onClick={() =>
                  setActiveAlternativeTab((prev) =>
                    prev === ArticleType.ARTICLE ? undefined : ArticleType.ARTICLE
                  )
                }
              >
                Articles only
              </Button>
            </li>
            <li>
              <Button
                variant="default"
                className={`rounded-full dark:bg-white/50 dark:hover:bg-white/65 ${
                  activeAlternativeTab === ArticleType.NEWS ? "dark:bg-white" : ""
                }`}
                onClick={() =>
                  setActiveAlternativeTab((prev) =>
                    prev === ArticleType.NEWS ? undefined : ArticleType.NEWS
                  )
                }
              >
                News only
              </Button>
            </li>
          </ul>
        </div>

        <Button onClick={toggleCreateNewArticleModal} variant="default">
          Create new article
          <PlusIcon size={24} className="ml-2" />
        </Button>
      </div>

      <ViewArticles
        organizationId={selectedOrganization!.id}
        activeTab={activeTab}
        articleType={activeAlternativeTab}
        setSelectedArticle={setSelectedArticle}
      />

      {/* View article modal */}
      {selectedArticle && (
        <CustomModal className="z-10">
          <ViewArticle onClose={() => setSelectedArticle(null)} article={selectedArticle} />
        </CustomModal>
      )}

      {/* Create new article modal */}
      {isCreateNewArticleModalOpen && (
        <CustomModal className="z-10">
          <CreateNewArticleModal
            onClose={toggleCreateNewArticleModal}
            organizationId={selectedOrganization?.id}
            onArticleCreated={() => {
              //refetchCommunityArticles();
              toggleCreateNewArticleModal();
            }}
          />
        </CustomModal>
      )}
    </div>
  );
}
