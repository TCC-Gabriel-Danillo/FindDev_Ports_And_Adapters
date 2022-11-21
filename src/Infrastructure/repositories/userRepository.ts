import { User } from "../../domain/entities/models";
import { UserRepository } from "../../domain/repositories";
import { getFirestore, setDoc, doc, Firestore, getDoc, collection, query, getDocs  } from 'firebase/firestore';


export class UserRepositoryImp implements UserRepository {
    firestore: Firestore;
    constructor(){
        this.firestore = getFirestore()
    }

    async createUser(user: User): Promise<void> {
        await setDoc(doc(this.firestore, "users", user.username), user)
    }
    async getUser(username: string): Promise<User> {
        const docRef = doc(this.firestore, "users", username);
        const docSnap = await getDoc(docRef); 
        return docSnap.data() as User

    }
    async listlUser(): Promise<Array<User>> {
        const docsRef = query(collection(this.firestore, "users"));
        const docsSnap = await getDocs(docsRef)
        const users: Array<User> = []
        
        docsSnap.forEach(snap => {
            const data = snap.data() as User
            users.push(data)
        })
        
        return users
    }  

 
}