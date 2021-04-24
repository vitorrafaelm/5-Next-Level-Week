import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    durationAsString: string; 
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasPrevious: boolean; 
    hasNext: boolean; 
    isLooping: boolean; 
    isShuffling: boolean; 
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void; 
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void; 
    playPrevious: () => void; 
    toggleLoop: () => void; 
    toogleShuffling: () => void; 
    clearPlayerState: () => void; 
}

type PlayerContextProviderProps = {
    children: ReactNode; 
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isLooping, setIsLooping] = useState(false); 
    const [isShuffling, setIsShuffling] = useState(false); 

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number){
        setEpisodeList(list); 
        setCurrentEpisodeIndex(index); 
        setIsPlaying(true); 
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toogleShuffling(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }
    
    function clearPlayerState(){
        setEpisodeList([]); 
        setCurrentEpisodeIndex(0); 
    }

    const hasPrevious = currentEpisodeIndex > 0; 
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length; 

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = 
                Math.floor(Math.random() * episodeList.length); 
            
                setCurrentEpisodeIndex(nextRandomEpisodeIndex); 
        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1); 
        } 
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1); 
        } 
    }

    return (
        <PlayerContext.Provider value={{
            currentEpisodeIndex, episodeList, play, isPlaying, togglePlay,
            setPlayingState, playList, playNext, playPrevious, hasPrevious, 
            hasNext, isLooping, toggleLoop, toogleShuffling, isShuffling, 
            clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext); 
}