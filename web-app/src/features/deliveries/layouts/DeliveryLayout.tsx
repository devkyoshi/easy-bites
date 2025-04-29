import { Header } from "@/components/layout/header";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface DeliveryLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
    showBackButton?: boolean;
    showAnalyticsButton?: boolean;
    onBackClick?: () => void;
    onAnalyticsClick?: () => void;
}

export function DeliveryLayout({
                                   children,
                                   title,
                                   description,
                                   showBackButton = false,
                                   showAnalyticsButton = false,
                                   onBackClick,
                                   onAnalyticsClick
                               }: DeliveryLayoutProps) {
    return (
        <>
            <Header>
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBackClick}
                            className="mr-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            Back
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-muted-foreground text-sm">{description}</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    {showAnalyticsButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onAnalyticsClick}
                            className="gap-1"
                        >
                            <span>Analytics</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                            </svg>
                        </Button>
                    )}
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <main className="container py-8">
                {children}
            </main>
        </>
    );
}