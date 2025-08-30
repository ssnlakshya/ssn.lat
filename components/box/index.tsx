import clsx from "clsx"
import { PropsWithChildren } from "react"
import { ThemeSwitcher } from "../switch-theme"
import Image from "next/image"

export function WaitlistWrapper({ children }: PropsWithChildren) {
  return (
    <div
      className={clsx(
        "w-full mx-auto max-w-[500px] flex flex-col justify-center items-center bg-gray-1/85 pb-0 overflow-hidden rounded-2xl",
        "shadow-[0px_170px_48px_0px_rgba(18,_18,_19,_0.00),_0px_109px_44px_0px_rgba(18,_18,_19,_0.01),_0px_61px_37px_0px_rgba(18,_18,_19,_0.05),_0px_27px_27px_0px_rgba(18,_18,_19,_0.09),_0px_7px_15px_0px_rgba(18,_18,_19,_0.10)]"
      )}
    >
      <div className="flex flex-col items-center gap-4 flex-1 text-center w-full p-8 pb-4">
        <div>
          <div className="flex justify-center items-center gap-4 mx-auto">
            <Image
              src="/lakshya.png"
              alt="Lakshya Logo"
              width={80}
              height={80}
              priority
              className="rounded-2xl"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">{children}</div>
      </div>
      <footer className="flex justify-between items-center w-full self-stretch px-8 py-3 text-sm bg-gray-12/[.07] overflow-hidden">
        <p className="text-xs text-slate-10">
          © 2025 Lakshya E-Cell of SSN. All rights reserved.
        </p>
        <ThemeSwitcher />
      </footer>
    </div>
  )
}
