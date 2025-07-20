import { IconWrapper } from "@subframe/core"
import Link from "next/link"
import { getServerSessionCache } from "@/features/auth/lib/session"
import { Button } from "@/ui"
import { GoogleIcon } from "@/ui/icons/google"
import { PostUrlForm } from "./PostUrlForm"

export async function LeftPageLayout() {
	const { isAuthenticated } = await getServerSessionCache()

	return (
		<div className="flex shrink-0 grow basis-0 flex-col items-center justify-center gap-6 self-stretch px-12 py-12">
			<div className="flex w-full max-w-[448px] flex-col items-start justify-center gap-8">
				<div className="flex w-full flex-col items-start gap-4">
					{/* TODO present new feature with a badge */}
					{/* <div className="flex items-center gap-1 rounded-md border border-neutral-100 border-solid bg-neutral-100 py-1 pr-2 pl-3">
						<span className="whitespace-nowrap font-['Inter'] text-caption text-default-font">
							Introducing QR Codes
						</span>
						<FeatherChevronRight className="font-['Inter'] font-[400] text-[10px] text-default-font" />
					</div> */}
					<span className="w-full font-heading-1 text-default-font text-heading-1">
						Shorten your links
					</span>
					<span className="w-full font-heading-2 text-heading-2 text-subtext-color">
						Transform long URLs into memorable short links in seconds
					</span>
				</div>

				<PostUrlForm />

				<div className="flex w-full items-center gap-2">
					<div className="flex h-px shrink-0 grow basis-0 flex-col items-center gap-2 bg-neutral-border" />
					<span className="font-body text-body text-subtext-color">or</span>
					<div className="flex h-px shrink-0 grow basis-0 flex-col items-center gap-2 bg-neutral-border" />
				</div>
				<div className="flex w-full flex-col items-center gap-2">
					{isAuthenticated ? (
						<Button
							asChild
							className="h-10 w-full flex-none"
							variant="brand-secondary"
							size="large"
						>
							<Link href="/dashboard">Access your Dashboard</Link>
						</Button>
					) : (
						<>
							<Button
								asChild
								className="h-10 w-full flex-none"
								variant="brand-secondary"
								size="large"
							>
								<a href="/api/auth/google">
									Create an account with{" "}
									<IconWrapper>
										<GoogleIcon />
									</IconWrapper>
								</a>
							</Button>
							<span className="font-body text-body text-subtext-color">
								Get access to private links and detailed analytics
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
