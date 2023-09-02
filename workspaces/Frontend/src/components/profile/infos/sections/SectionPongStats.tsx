import styles from "@/styles/profile/InfoCard.module.css";
import Item from "./Item";
import MottoDisplayOnly from "./tagline/MottoDisplayOnly";
import StoryDisplayOnly from "./story/StoryDisplayOnly";
import { useEffect, useState } from "react";
import StatsService from "@/services/Stats.service";
import StoryService from "@/services/Story.service";
import StoryLevel from "./ItemContent/StoryLevel";
import Winrate from "./ItemContent/Winrate";
import { UserLeaderboard } from "@transcendence/shared/types/Leaderboard.types";
import LobbyService from "@/services/Lobby.service";
import Rank from "./ItemContent/Rank";

type Props = {
  profile: Profile;
};

type ProfilStats = {
  gameWon: number, 
  gameLost:number, 
  leagueWon: number,
  leagueLost: number,
  rank:number,
}

export default function SectionPongStats({ profile }: Props) {

    const [storyLevel, setStoryLevel] = useState<number>(0);
    const [winData, setWinData] = useState<ProfilStats>({gameWon: 0, gameLost: 0, leagueWon:0, leagueLost:0, rank:0});
    const storyService = new StoryService(undefined);
    const statService = new StatsService(undefined);
    const lobbyService = new LobbyService(undefined);

    const loadStats = async () => {
      try {
        const rep = await statService.getFullStats(profile.id);

        if (rep.success && rep.data) {
            //console.log("STATS FETCHING => data : ", rep.data); // checking

            setWinData({...winData,
              gameWon: rep.data.gameWon,
              gameLost: rep.data.gameLost,
            });
        } else {
          throw new Error(rep.message);
        }

      } catch(error:any) {
        console.log(`loadStats error : ${error.message}`)
      }
    }

    const loadLeaderboard = async () => {
      try {
        const rep:ReturnDataTyped<UserLeaderboard[]> = await lobbyService.getLeaderboard();

        if (rep.success && rep.data) {
          console.log("LEADERBOARD FETCHING => data : ", rep.data); // checking

          const myBoard:UserLeaderboard | undefined = rep.data.find((userBoard) => userBoard.userId === profile.id);
          if (myBoard !== undefined && myBoard.rank > 0) {
            setWinData({...winData,
              leagueWon: myBoard.win,
              gameLost: myBoard.lost,
              rank:myBoard.rank
            });
          }

      } else {
        throw new Error(rep.message);
      }
      
      } catch(error:any) {
        console.log(`SectionPongStats => loadLeaderboard error : ${error.message}`)
      }
    }

    const loadStory = async () => {
        try {
          const rep = await storyService.getUserStories(profile.id);
  
          if (rep !== undefined && rep.success) {
              // console.log("STORY FETCHING => data : ", rep.data);  // checking
              let checkLevel: number = 0;
              while (rep.data[checkLevel].levelCompleted) {
                  checkLevel++;
              }
              setStoryLevel(checkLevel);
          } else {
            throw new Error(rep !== undefined ? rep.message : "loadStory error : response undefined");
          }
        } catch(error:any) {
          console.log(`loadStory error : ${error.message}`)
        }
    }

    useEffect(() => {
        loadStats();
        loadStory();
        loadLeaderboard();
      }, [])

  return (
    <div className={styles.sections}>

      <MottoDisplayOnly profile={profile} />

      <StoryDisplayOnly profile={profile} />

      <p className={styles.tinyTitle}>League</p>
      
        <Rank rank={winData.rank} />
      

      <Item title="League Winrate">
        <Winrate winData={{gameWon:winData.leagueWon, gameLost:winData.leagueLost}} />
      </Item>

      <p className={styles.tinyTitle}>Play for fun</p>
      <Item title="Story Level">
        <StoryLevel storyLevel={storyLevel} />
      </Item>

      <Item title="Global Winrate">
        <Winrate winData={{gameWon:winData.gameWon, gameLost:winData.gameLost}} />
      </Item>


      <Item title="Recent Achievements">
        <p>items content : customize it with a specific component</p>
      </Item>

      <Item title="Recent games">
        <p>items content : customize it with a specific component</p>
      </Item>


    </div>
  );
}
