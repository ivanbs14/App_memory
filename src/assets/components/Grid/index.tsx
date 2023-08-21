import './styles.css';

import { Card, CardProps } from '../card';
import { useRef, useState } from 'react';
import { duplicateRegenarateSortArray } from '../../utils/cardUtils';
import audioTouch from '../../songs/pokemon-exclamation-mark-sound-effect.mp3';
import audioWinner from '../../songs/pokemon-red_blue_yellow-save-game-sound-effect.mp3';
import audioEnd from '../../songs/pokimons.mp3';
import imageAfterMatch from '../../../../public/743.png';

export interface gridProps{
    cards: CardProps[];
};

export function Grid({ cards }: gridProps) {
    const [stateCards, setStateCards] = useState(() => {
        return duplicateRegenarateSortArray(cards);
    });
    const [matches, setMatches] = useState(0)
    const [moves, setMoves] = useState(0)
    // manipulaçao de audio
    
    // estado para armazenar os dados dos 2 cards virados
    const first = useRef<CardProps | null>(null);
    const second = useRef<CardProps | null>(null);
    // estado para manter os 2 cards virados, ate o clique do terceiro card.
    const unflip = useRef(false);
    // config songs
    const songTouch = useRef<HTMLAudioElement | null>(null);
    const songWinner = useRef<HTMLAudioElement | null>(null);
    const songEnd = useRef<HTMLAudioElement | null>(null);
    const playAudio = (song: number) => {
        if (songTouch.current && song == 0) {
            songTouch.current.currentTime = 0; // Reinicia a reprodução para tocar desde o início
            songTouch.current.volume = 0.1;
            songTouch.current.play();
        }
        
        if (songWinner.current && song == 1) {
            songWinner.current.currentTime = 0; // Reinicia a reprodução para tocar desde o início
            songWinner.current.volume = 0.2;
            songWinner.current.play();
        }
        
        if (songEnd.current && song == 2) {
            songEnd.current.currentTime = 0; // Reinicia a reprodução para tocar desde o início
            songEnd.current.volume = 0.2;
            songEnd.current.play();
        }
    };

    //fuction reset
    const handleReset= () => {
        setStateCards(duplicateRegenarateSortArray(cards));
        first.current = null;
        second.current = null;
        unflip.current = false;
        setMatches(0);
        setMoves(0);
    }

    const handleClick = (id: string) =>{
        const newStateCards = stateCards.map((card) => {
            // se o id do cartao nao for o id clicado, nao faz nada.
            if (card.id != id) return card;
            // se o cartao ja estiver virado, nao faz nada.
            if (card.flipped) return card;
            // desvira possiveis cartas erradas apos terceiro click.
            if (unflip.current && first.current && second.current) {
                // a pessoa errou a carta
                first.current.flipped = false;
                second.current.flipped = false;
                first.current = null;
                second.current = null;
                unflip.current = false;
            }
            // virar o card
            card.flipped = true;
            // configura primeiro e segundo card clicados
            if(first.current == null) {
                first.current = card;
                playAudio(0);
            } else if (second.current == null) {
                second.current = card;
                playAudio(0);
            }
            // checando os 2 card virados se estao certos.
            if (first.current && second.current) {
                if (first.current.back == second.current.back) {
                    // a pessoa acertou
                    first.current = null;
                    second.current = null;
                    setMatches((m) => m + 1);
                    playAudio(1);
                } else {
                    // a pessoa errou, desvire as 2 cartas.
                    unflip.current = true;
                }

                setMoves((m) => m + 1);

                if (matches == 3) {
                    playAudio(2);
                }
            }
            return card;
        });

        setStateCards(newStateCards);
    };

    return (
        <>
            <div className="text">
                <h1>Jogo da memória</h1>
                <p>Movimentos: {moves} | Pontuação: {matches}</p>
                <button className='btn' onClick={() => handleReset()}>Recomeçar</button>
            </div>

            {matches === 4 && (
                <img className='winner' src={imageAfterMatch} alt="Imagem após combinação" />
            )}

            <div className='grid'>
                <audio ref={songTouch} src={audioTouch} />
                <audio ref={songWinner} src={audioWinner} />
                <audio ref={songEnd} src={audioEnd} />
                {matches != 4 && (
                    stateCards.map((card) => {
                        return <Card {...card} key={card.id} handleClick={handleClick}/>
                    })
                )}
            </div>
        </>
    )
}