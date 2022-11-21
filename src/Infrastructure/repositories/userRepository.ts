import { ListUserParams, User } from "../../domain/entities/models";
import { UserRepository } from "../../domain/repositories";
import { getFirestore, setDoc, doc, Firestore, getDoc, collection, query, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';


export class UserRepositoryImp implements UserRepository {
    firestore: Firestore;
    constructor(){
        this.firestore = getFirestore()
    }

    async addUser(user: User): Promise<void> {
        await setDoc(doc(this.firestore, "users", user.username), user)
    }
    async getUser(username: string): Promise<User> {
        const docRef = doc(this.firestore, "users", username);
        const docSnap = await getDoc(docRef); 
        return docSnap.data() as User

    }
    async listUsers(listUserParams: ListUserParams): Promise<Array<User>> {
        let docsRef = query(collection(this.firestore, "users"));

        if(listUserParams){
            const {type, start, end} = listUserParams
            docsRef = query(
                collection(this.firestore, 'users'), 
                orderBy(type), 
                startAt(start), 
                endAt(end)
            )
        }   
        
        const docsSnap = await getDocs(docsRef)
        const users: Array<User> = []
        
        docsSnap.forEach(snap => {
            const data = snap.data() as User
            users.push(data)
        })
        
        return users
    }   
}