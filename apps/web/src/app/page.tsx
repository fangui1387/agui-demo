"use client";

import { useCoAgent, useCopilotAction, useHumanInTheLoop } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  useCopilotAction({
    name: "setThemeColor",
    description: "Set the theme color of the page.",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set. Make sure to pick nice colors.",
      required: true,
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  useCopilotAction({
    name: "sayHello",
    description: "和用户打招呼",
    parameters: [{
      name: "name",
      description: "用户名字，如果没有，就用张三代替",
    }],
    handler({ name }) {
      alert(`你好，${name}`)
    },
  });

  

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <YourMainContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Popup Assistant",
          initial: "👋 通过AGUI协议，你能与智能体进行动态交互. \n例如:\n- **Frontend Tools**: \"更改页面主题\"\n- **Frontend Tools**: \"更改窗口位置\"\n- **Frontend Tools**: \"调用页面脚本alert（向用户打招呼）\"\n- **Frontend Tools**: \"动态渲染UI\"\n\n- **Frontend Tools**: \"动态更新列表\"."
          
        }}
      />
    </main>
  );
}

// State of the agent, make sure this aligns with your agent's state.
type AgentState = {
  proverbs: string[];
}



function YourMainContent({ themeColor }: { themeColor: string }) {
  // 独立的 state，与 coagent 无关
  const [localState, setLocalState] = useState("center, center");

  const { state, setState } = useCoAgent<AgentState>({
    name: "starterAgent",
    initialState: {
      proverbs: [
        "CopilotKit may be new, but its the best thing since sliced bread.",
      ]
    },
  })

  const getPositionClasses = (position: string) => {
    const positions = position.split(',').filter(p => p);
    let classes = ' items-center justify-center';
    for (let pos of positions) {
      pos = pos.trim()
      switch(pos) {
        case 'center':
          classes += ' items-center justify-center';
          break;
        case 'top':
          classes += ' justify-start';
          break;
        case 'bottom':
          classes += ' justify-end';
          break;
        case 'left':
          classes += ' items-start';
          break;
        case 'right':
          classes += ' items-end';
          break;
      }
    }
 
    
    return classes;
  };


  useCopilotAction({
    name: "addProverb",
    description: "Add a proverb to the list.",
    parameters: [{
      name: "proverb",
      description: "The proverb to add. Make it witty, short and concise.",
      required: true,
    }],
    handler: ({ proverb }) => {
      setState((prevState) => ({
        ...prevState,
        proverbs: [...(prevState?.proverbs || []), proverb],
      }));
    },
  }, [setState]);

  useCopilotAction({
    name: "getWeather",
    description: "Get the weather for a given location.",
    available: "disabled",
    parameters: [
      { name: "location", type: "string", required: true },
    ],
    render: ({ args }) => {
      return <WeatherCard location={args.location} themeColor={themeColor} />
    },
  });
  // 移动窗口位置
  useCopilotAction({
    name: "movePop",
    description: "移动窗口布局",
    parameters: [{
      name: "position",
      description: "要移动的位置，请自动转换，如果是顶部或上部，就转换为top，依此类推，如果是左上，请返回left, top, 用，隔开, 中间用center表示",
    }],
    handler({ position }) {
      setLocalState(position);
    },
  }, [setLocalState]);


  // 人机交互生成日程
  useHumanInTheLoop({ 
    name: "生成日程",
    description: "帮我生成一个日程信息",
    parameters: [
     
      {
        name: "date",
        type: "string",
        description: "日程时间",
        required: true,
      },
      {
        name: "place",
        type: "string",
        description: "日程地点",
        required: true,
      },
    ],
    render: ({ args, respond, status }) => {
      const { date, place } = args;
      return (
        <RenderMetting
          date={date!}
          place={place!}
          onConfirm={() => respond?.('meeting confirmed')}
          onCancel={() => respond?.('meeting canceled')}
        />
      );
    },
    });

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className={`h-screen w-screen flex flex-col transition-colors duration-300${getPositionClasses(localState || 'center, center')}`}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Proverbs</h1>
        <p className="text-gray-200 text-center italic mb-6">This is a demonstrative page, but it could be anything you want! 🪁</p>
        <hr className="border-white/20 my-6" />
        <div className="flex flex-col gap-3">
          {state.proverbs?.map((proverb, index) => (
            <div
              key={index}
              className="bg-white/15 p-4 rounded-xl text-white relative group hover:bg-white/20 transition-all"
            >
              <p className="pr-8">{proverb}</p>
              <button
                onClick={() => setState({
                  ...state,
                  proverbs: state.proverbs?.filter((_, i) => i !== index),
                })}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity
                  bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {state.proverbs?.length === 0 && <p className="text-center text-white/80 italic my-8">
          No proverbs yet. Ask the assistant to add some!
        </p>}
      </div>
    </div>
  );
}

// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-yellow-200">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}

// Weather card component where the location and themeColor are based on what the agent
// sets via tool calls.
function WeatherCard({ location, themeColor }: { location?: string, themeColor: string }) {
  return (
    <div
    style={{ backgroundColor: themeColor }}
    className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
  >
    <div className="bg-white/20 p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white capitalize">{location}</h3>
          <p className="text-white">Current Weather</p>
        </div>
        <SunIcon />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-bold text-white">70°</div>
        <div className="text-sm text-white">Clear skies</div>
      </div>

      <div className="mt-4 pt-4 border-t border-white">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-white text-xs">Humidity</p>
            <p className="text-white font-medium">45%</p>
          </div>
          <div>
            <p className="text-white text-xs">Wind</p>
            <p className="text-white font-medium">5 mph</p>
          </div>
          <div>
            <p className="text-white text-xs">Feels Like</p>
            <p className="text-white font-medium">72°</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}


function RenderMetting({date, place, onConfirm, onCancel}: {date: string, place: string, onConfirm: Function, onCancel: Function}) {
  return (
    <div className="metting-container">
      <div className="metting-title">最新日程</div>
      <div className="metting-form">
        <div className="metting-date">时间：{ date }</div>
        <div className="metting-place">地点：{ place }</div>
      </div>
      <div className="metting-button-group">
          <div className="metting-button" onClick={() => onCancel?.('cancel')}>取消</div>
          <div className="metting-button active" onClick={() => onConfirm?.('agree')}>确认</div>
      </div>
 
    </div>
  )
}
