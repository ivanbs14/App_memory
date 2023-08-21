import { CardProps } from "../components/card";

/* generating random id 
Math.random(); gera um valor entre 0 e 1
toString(36); gera valores ate 36
substring(2, 15); elimina os 2 valores antes e pega os outro 15 digitos.
*/
const keyGen = (): string => {
    return (
        Math.random().toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15)
    )
}

/* fuction duplicate cards */
export const duplicateArray = <T>(array: T[]): T[] => {
    return array.concat(array);
};

/* display random cards */
export const sortArray = <T>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

/* resetting card ID on every reset click */
export const regenerationId = (cards: CardProps[]): CardProps[] => {
    return cards.map((card) => ({ ...card, id: keyGen() }));
}

export const duplicateRegenarateSortArray = (cards: CardProps[]): CardProps[] => {
    return sortArray(regenerationId(duplicateArray(cards)));
}
