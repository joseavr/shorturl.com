import { FeatherChevronRight, FeatherLink, IconWrapper } from "@subframe/core"
import Link from "next/link"
import { Button, TextField, TextFieldInput } from "@/ui"
import { GoogleIcon } from "@/ui/icons/google"

export function LeftPageLayout() {
	return (
		<div className="flex shrink-0 grow basis-0 flex-col items-center justify-center gap-6 self-stretch px-12 py-12">
			<div className="flex w-full max-w-[448px] flex-col items-start justify-center gap-8">
				<div className="flex w-full flex-col items-start gap-4">
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
				<div className="flex w-full flex-col items-start justify-center gap-4">
					<TextField
						className="h-auto w-full flex-none"
						variant="filled"
						label=""
						helpText=""
						icon={<FeatherLink />}
					>
						<TextFieldInput
							placeholder="Enter your URL here"
							// value=""
							// onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
						/>
					</TextField>
					<Button
						className="h-10 w-full flex-none"
						size="large"
						// onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
					>
						Shorten URL
					</Button>
				</div>
				<div className="flex w-full items-center gap-2">
					<div className="flex h-px shrink-0 grow basis-0 flex-col items-center gap-2 bg-neutral-border" />
					<span className="font-body text-body text-subtext-color">or</span>
					<div className="flex h-px shrink-0 grow basis-0 flex-col items-center gap-2 bg-neutral-border" />
				</div>
				<div className="flex w-full flex-col items-center gap-2">
					<Button
						asChild
						className="h-10 w-full flex-none"
						variant="brand-secondary"
						size="large"
					>
						<Link href="/login">
							Create an account with{" "}
							<IconWrapper>
								<GoogleIcon />
							</IconWrapper>
						</Link>
					</Button>
					<span className="font-body text-body text-subtext-color">
						Get access to private links and detailed analytics
					</span>
				</div>
			</div>
		</div>
	)
}
