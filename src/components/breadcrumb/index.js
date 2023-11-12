import Link from 'next/link';
import { useRouter } from 'next/router';
import { FcHome } from 'react-icons/fc';

const Breadcrumb = ({ name }) => {
    const router = useRouter();
    const { asPath } = router;
    const segments = asPath.split('/').filter(Boolean);

    const updatedSegments = segments.map((segment, index) => {
        if (/^[0-9a-fA-F]{24}$/.test(segment) && name) {
            return name;
        }
        return segment;
    });
    return (
        <div className="breadcrumbs">
            <div>
                <Link href="/">
                    <FcHome size="25" className='breadcrumbIcon' />
                </Link>
                {updatedSegments.map((segment, index) => {
                    const isLastSegment = index === updatedSegments.length - 1;
                    return (
                        <span key={segment} className='fw-bold'>
                            {' / '}
                            {isLastSegment ? (
                                segment
                            ) : (
                                <Link className='text-decoration-none'
                                    href={`/${segments.slice(0, index + 1).join('/')}`}>
                                    {segment}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumb;
