import {faBars } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuthStore } from "@/modules/auth/store/authStore";

type Props = {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
};

const AppHeader = ({
  title,
  subtitle,
  onMenuClick,
}: Props) => {

  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <header
      className="
        h-20
        bg-white
        border-b
        border-slate-200
        px-4
        md:px-6
        flex
        items-center
        justify-between
        shadow-sm
        shrink-0
      "
    >

      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            w-11
            h-11
            rounded-xl
            border
            border-slate-200
            flex
            items-center
            justify-center
            hover:bg-slate-100
          "
        >

          <FontAwesomeIcon
            icon={faBars}
          />

        </button>

        <div>

          <h2
            className="
              text-lg
              md:text-2xl
              font-bold
              text-slate-800
            "
          >
            {title}
          </h2>

          <p
            className="
              hidden
              md:block
              text-slate-500
              text-sm
              mt-1
            "
          >
            {subtitle}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <div
          className="
            flex
            items-center
            gap-3
            bg-slate-100
            px-2
            md:px-4
            py-2
            rounded-xl
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-cyan-500
              text-white
              flex
              items-center
              justify-center
              font-bold
              uppercase
              shrink-0
            "
          >
            {user?.username?.charAt(0)}
          </div>

          <div className="hidden sm:block">

            <p
              className="
                font-semibold
                text-slate-800
                leading-none
              "
            >
              {user?.username}
            </p>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
                capitalize
              "
            >
              {user?.fullname}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AppHeader;