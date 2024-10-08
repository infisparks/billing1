"use client"; // Ensure this component runs in the client side
import React, { useEffect, useState } from 'react';
import { auth } from '../../lib/firebaseConfig'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebaseConfig'; // Adjust the path for your database
import { ref, get } from 'firebase/database'; // If using Realtime Database
// Or if using Firestore
// import { doc, getDoc } from 'firebase/firestore'; 

export default function Layout({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // If user is not logged in, redirect to the login page
                router.push('/'); // Change to your login route
                return;
            }

            // Fetch user role from your database
            const userRef = ref(db, `users/${user.uid}`); // Adjust the path as necessary
            // For Firestore
            // const userDoc = await getDoc(doc(db, 'users', user.uid));
            // const userData = userDoc.data();

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData.role !== 'admin') {
                        // If user is not an admin, redirect to unauthorized page
                        router.push('/unauthorized'); // Change to your unauthorized route
                    }
                } else {
                    // Handle case where user data doesn't exist
                    router.push('/unauthorized'); // Change to your unauthorized route
                }
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching user role:', error);
                setLoading(false);
            });
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [router]);

    // Show a loading state while checking authentication and role
    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton
    }

    return (
        <div className="container mt-4">
            {children}
        </div>

    );
}