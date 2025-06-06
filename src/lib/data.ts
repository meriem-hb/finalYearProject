
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, doc, writeBatch, getDoc } from 'firebase/firestore';
import type { CommunityQuestion, Answer } from '@/types';

/**
 * Adds a new question to Firestore.
 * @param questionData The core data for the question.
 * @param authorId UID of the question author.
 * @param authorName Display name of the question author.
 * @returns The ID of the newly created question document or null on error.
 */
export async function addQuestion(
  questionData: Omit<CommunityQuestion, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'votes' | 'answersCount' | 'views' | 'questionType' | 'authorPhotoURL'>,
  authorId: string,
  authorName: string,
  authorPhotoURL?: string | null
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...questionData,
      authorId,
      authorName,
      authorPhotoURL: authorPhotoURL || null,
      votes: 0,
      answersCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding question to Firestore: ", error);
    return null;
  }
}


/**
 * Fetches community questions from Firestore.
 * @returns {Promise<CommunityQuestion[]>} An array of community questions.
 */
export async function getQuestions(): Promise<CommunityQuestion[]> {
  try {
    const questionsCol = collection(db, 'questions');
    const q = query(questionsCol, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const questions: CommunityQuestion[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      questions.push({
        id: docSnap.id,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        votes: data.votes || 0,
        answersCount: data.answersCount || 0,
        views: data.views || 0,
        subject: data.subject,
        gradeLevel: data.gradeLevel,
        questionType: data.questionType,
        authorId: data.authorId,
        authorName: data.authorName,
        authorPhotoURL: data.authorPhotoURL,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      } as CommunityQuestion);
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions from Firestore: ", error);
    return [];
  }
}

/**
 * Adds a new answer to a specific question in Firestore.
 * Also increments the answersCount on the question document.
 * @param questionId The ID of the question being answered.
 * @param answerData The answer data.
 * @returns The ID of the newly created answer document or null on error.
 */
export async function addAnswer(
  questionId: string,
  answerData: Pick<Answer, 'content' | 'authorId' | 'authorName' | 'authorPhotoURL'>
): Promise<string | null> {
  if (!questionId) {
    console.error("Question ID is required to add an answer.");
    return null;
  }
  try {
    const questionRef = doc(db, 'questions', questionId);
    const answersColRef = collection(questionRef, 'answers');

    const batch = writeBatch(db);

    // Add the new answer
    const newAnswerRef = doc(answersColRef); // Auto-generate ID
    batch.set(newAnswerRef, {
      ...answerData,
      questionId, // Store questionId for denormalization if needed, though it's implied by subcollection
      votes: 0,
      isAccepted: false,
      createdAt: serverTimestamp(),
    });

    // Increment answersCount on the question
    // Note: For robust counters, consider Firebase Functions for atomic updates,
    // but for now, we'll do a client-side read and write (less robust for high concurrency).
    // A simpler approach for now: just update, assuming it's generally accurate enough for this stage.
    // For a truly atomic increment, you would useFieldValue.increment(1), but that's for updateDoc.
    // Let's fetch the current question to update its answersCount more reliably.
    const questionSnap = await getDoc(questionRef);
    if (questionSnap.exists()) {
      const currentAnswersCount = questionSnap.data().answersCount || 0;
      batch.update(questionRef, {
        answersCount: currentAnswersCount + 1,
      });
    } else {
      console.warn(`Question with ID ${questionId} not found. Cannot update answersCount.`);
    }


    await batch.commit();
    return newAnswerRef.id;

  } catch (error) {
    console.error("Error adding answer to Firestore: ", error);
    return null;
  }
}

/**
 * Fetches answers for a specific question from Firestore.
 * @param questionId The ID of the question.
 * @returns {Promise<Answer[]>} An array of answers.
 */
export async function getAnswers(questionId: string): Promise<Answer[]> {
  if (!questionId) {
    console.error("Question ID is required to fetch answers.");
    return [];
  }
  try {
    const answersCol = collection(db, 'questions', questionId, 'answers');
    const q = query(answersCol, orderBy('createdAt', 'asc')); // Oldest first, or 'desc' for newest
    const querySnapshot = await getDocs(q);

    const answers: Answer[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      answers.push({
        id: docSnap.id,
        questionId: data.questionId, // or just questionId param
        authorId: data.authorId,
        authorName: data.authorName,
        authorPhotoURL: data.authorPhotoURL,
        content: data.content,
        votes: data.votes || 0,
        isAccepted: data.isAccepted || false,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      } as Answer);
    });
    return answers;
  } catch (error) {
    console.error(`Error fetching answers for question ${questionId} from Firestore: `, error);
    return [];
  }
}
