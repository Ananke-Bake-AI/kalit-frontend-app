import { Container } from "@/components/container"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Logotype } from "@/components/logotype"
import clsx from "clsx"
import Image from "next/image"
import s from "./choose.module.scss"

const Check = () => {
  return <Icon icon="hugeicons:tick-02" className={s.check} />
}

const Cross = () => {
  return <Icon icon="hugeicons:cancel-circle" className={s.cross} />
}

export const Choose = () => {
  const iconCol = [
    "hugeicons:apple-reminder",
    "hugeicons:user-group",
    "hugeicons:keyframes-multiple-add",
    "hugeicons:artificial-intelligence-03",
    "hugeicons:magic-wand-01",
    "hugeicons:translate",
    "hugeicons:property-search",
    "hugeicons:bug-02",
    "hugeicons:chart-breakout-circle",
    "hugeicons:chrome"
  ] as const

  const rows = [
    {
      label: "No-Code App Builder",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "AI Agents Team",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "Multiple Generation",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "AI Co-Founder",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "Suitable for Beginners",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "One-click Translated Apps",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "AI Audience Research",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "AI Auto Bug Fixing",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "Advanced App Analytics",
      description: "Post hoc impie perpetratum in quoque"
    },
    {
      label: "Build Chrome Extensions",
      description: "Post hoc impie perpetratum in quoque"
    }
  ] as const

  const columns = [
    {
      key: "iconCol",
      isIconCol: true,
      cells: iconCol
    },
    {
      key: "labels",
      isLabel: true,
      cells: rows
    },
    {
      key: "kalit",
      isKalit: true,
      cells: ["check", "check", "check", "check", "check", "check", "check", "check", "check", "check"]
    },
    {
      key: "col-1",
      logo: "claude",
      cells: ["check", "cross", "cross", "check", "cross", "cross", "cross", "check", "cross", "cross"]
    },
    {
      key: "col-2",
      logo: "lovable",
      cells: ["cross", "cross", "check", "check", "cross", "cross", "check", "cross", "cross", "cross"]
    },
    {
      key: "col-3",
      logo: "bolt",
      cells: ["cross", "check", "cross", "cross", "cross", "cross", "cross", "cross", "cross", "check"]
    },
    {
      key: "col-4",
      logo: "base44",
      cells: ["cross", "cross", "cross", "cross", "cross", "cross", "cross", "cross", "cross", "cross"]
    },
    {
      key: "col-5",
      logo: "replit",
      cells: ["cross", "cross", "cross", "cross", "cross", "cross", "check", "cross", "cross", "cross"]
    }
  ] as const

  return (
    <section className={s.choose}>
      <Container>
        <Heading
          className={s.heading}
          subtitle="All Features"
          paragraph="Post hoc impie perpetratum quod in aliis quoque iam timebatur, tamquam licentia crudelitati indulta."
        >
          Why choose{" "}
          <span data-icon="right">
            Kalit?
            <span data-icon-svg>
              <Icon icon="kalit" />
            </span>
          </span>
          <svg viewBox="0 0 941 241" className={clsx(s.line, s.line1)}>
            <path
              d="M6.5 240.5V224.501C6.5 202.41 24.4086 184.501 46.5 184.501H361.5C383.591 184.501 401.5 166.592 401.5 144.501V87C401.5 72.3645 389.636 60.5 375 60.5C360.364 60.5 348.5 72.3645 348.5 87C348.5 101.636 360.364 113.5 375 113.5H634.5C656.591 113.5 674.5 95.5914 674.5 73.5V46.5C674.5 24.4086 692.409 6.5 714.5 6.5H1224.19"
              stroke="url(#choose_line)"
            />
          </svg>
        </Heading>
        <div className={s.tableContainer}>
          <div className={s.table}>
            {columns.map((column) => (
              <div
                key={column.key}
                className={clsx(
                  s.col,
                  "isIconCol" in column && column.isIconCol && s.iconCol,
                  "isLabel" in column && column.isLabel && s.label,
                  "isKalit" in column && column.isKalit && s.kalit
                )}
              >
                {"isKalit" in column && column.isKalit && <Logotype className={s.logotype} />}

                {"logo" in column && column.logo && (
                  <div className={s.logo}>
                    <Image src={`/img/${column.logo}.png`} alt={column.logo} width={95} height={42} quality={80} />
                  </div>
                )}

                {column.cells.map((cell, index) => {
                  if ("isIconCol" in column && column.isIconCol) {
                    return (
                      <div key={`${column.key}-${index}`} className={s.row}>
                        <Icon icon={cell as string} className={s.icon} />
                      </div>
                    )
                  }

                  if (typeof cell === "object") {
                    return (
                      <div key={`${column.key}-${index}`} className={s.row}>
                        <div className={s.title}>
                          <div className={s.right}>
                            <div className={s.name}>{cell.label}</div>
                            <div className={s.description}>{cell.description}</div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={`${column.key}-${index}`} className={s.row}>
                      {cell === "check" && <Check />}
                      {cell === "cross" && <Cross />}
                    </div>
                  )
                })}
                {"isKalit" in column && column.isKalit && <div className={s.bg} />}
              </div>
            ))}
            <div className={s.tableBg} />
          </div>
        </div>
      </Container>
    </section>
  )
}
