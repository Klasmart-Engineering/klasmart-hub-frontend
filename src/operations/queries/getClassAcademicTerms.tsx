import { ClassesFilter } from "@/api/classes";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface AcademicTermFilter {
    organizationId: string;
    search: string;
    filters: ClassesFilter[];
}

export const buildClassAcademicTermSearchFilter = (search: string): ClassesFilter => ({
    ...(isUuid(search) ? {
        id: {
            operator: `eq`,
            value: search,
        },
    } : {
        OR: [
            {
                name: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
        ],
    }),
});

export const buildClassAcademicTermFilter = (filter: AcademicTermFilter): ClassesFilter => ({
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [ buildClassAcademicTermSearchFilter(filter.search), ...filter.filters ],
});

export const GET_CLASS_ACADEMIC_TERMS = gql`
query ClassesConnection(
    $direction: ConnectionDirection!
    $count: PageSize
    $cursor: String
    $orderBy: ClassSortBy!
    $order: SortOrder!
    $filter: ClassFilter
){
    classesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        sort: { field: $orderBy, order: $order }
        filter: $filter
    ){
      edges{
        node{
          id
          name
          academicTerm{
            id
            name
          }
          schoolsConnection{
            edges{
              node{
                id
                name
                academicTermsConnection{
                  edges{
                    node{
                      id
                      name
                      startDate
                      endDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
