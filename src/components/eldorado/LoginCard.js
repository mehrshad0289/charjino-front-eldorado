/* Sign-in card from the login.eldorado.gg capture: dark 402px card with
   the form logo, "Sign in", three OAuth buttons, "Or" divider, the email
   form and the yellow Next button. Card text renders in Open Sans per the
   capture's font stack (the marketplace pages use Lato). Reusable for a
   future signup page (title/labels come from props-driven data). */
import { LOGIN_PAGE, LOGIN_SOCIAL_ICONS } from "./data/dashboardData";

export default function LoginCard({ data = LOGIN_PAGE, icons = LOGIN_SOCIAL_ICONS }) {
  return (
    <div className="w-full max-w-[402px] min-w-0">
      <div className="w-full rounded-lg border-[0.8px] border-[rgb(66,_70,_80)] bg-[rgb(30,_31,_40)] p-6">
        <div className="text-[14px] leading-[20px] text-[rgb(160,_158,_169)]">
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <img alt={data.logoAlt} src={data.logo} className="inline h-[60px] max-w-60 object-contain text-center align-middle" />
            </div>
            <h2 className="py-[5px] text-left text-[24px] font-bold leading-[30px] text-white">{data.title}</h2>
            <div>
              <h4 className="py-1 text-[16px] font-bold tracking-[-0.08px] text-white">{data.socialHeading}</h4>
              <div className="mt-3 flex flex-col gap-3">
                {data.socialButtons.map((b) => (
                  <span key={b.label}>
                    <a
                      href={b.href}
                      className="inline-block w-full rounded-lg border-2 border-[rgb(40,_40,_54)] bg-[rgb(40,_40,_54)] px-5 py-1 text-center font-bold tracking-[0.07px] text-white"
                    >
                      <span className="relative -left-1 mr-1 inline-block h-5 w-4 pt-0.5 align-top text-center">
                        <img alt={`${b.icon} icon`} src={icons[b.icon]} className="size-4 object-contain align-middle" />
                      </span>
                      <span className="text-center">{b.label}</span>
                    </a>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex w-full max-w-[354px] items-center py-6">
                <span className="h-px grow bg-[rgb(42,_42,_55)]" />
                <span className="mx-[10px] block">{data.divider}</span>
                <span className="h-px grow bg-[rgb(42,_42,_55)]" />
              </div>
              <form aria-label="primary-form">
                <div className="flex flex-col gap-5">
                  <h4 className="py-1 text-[16px] font-bold tracking-[-0.08px] text-white">{data.formHeading}</h4>
                  <div>
                    <label className="font-bold text-white" htmlFor="login-email">
                      {data.emailLabel}
                    </label>
                    <div className="pt-1">
                      <input
                        id="login-email"
                        type="email"
                        placeholder={data.emailPlaceholder}
                        className="block min-h-8 w-full rounded-lg border-[0.8px] border-[rgb(198,_198,_204)] bg-[rgb(42,_42,_55)] px-3 pb-[5px] pt-[5px] text-white outline-none placeholder:text-[rgb(160,_158,_169)]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="inline-block w-full rounded-lg border-2 border-brand bg-brand px-5 py-1 text-center font-bold tracking-[0.07px] text-ink"
                    >
                      <span className="text-center">{data.nextLabel}</span>
                    </button>
                    <p className="px-0 py-px text-center">
                      {data.signup.prefix}
                      <a href={data.signup.href} className="text-[rgb(71,_131,_255)]">
                        {data.signup.label}
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
