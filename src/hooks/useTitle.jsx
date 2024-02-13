import { useEffect } from 'react';

const useTitle = (title) => {
    useEffect(() => {
        document.title = `${title} - TransmissionModule`;
    }, [title])
};

export default useTitle;